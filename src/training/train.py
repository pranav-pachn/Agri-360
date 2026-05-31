import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

# ==========================================
# 1. Configuration
# ==========================================
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ai', 'data', 'PlantVillage'))
MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models'))
os.makedirs(MODELS_DIR, exist_ok=True)

BATCH_SIZE = 8
IMG_SIZE = (224, 224)
EPOCHS_FROZEN = 10
EPOCHS_UNFROZEN = 10
LEARNING_RATE_FROZEN = 1e-3
LEARNING_RATE_UNFROZEN = 1e-5

print(f"Dataset directory: {DATA_DIR}")

# ==========================================
# 2. Data Loading & Splitting
# ==========================================
print("\n--- Phase A: Data Loading ---")

# Load training dataset (80%)
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=1337,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Load validation/test dataset (20%)
val_test_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=1337,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
num_classes = len(class_names)
print(f"Found {num_classes} classes: {class_names}")

# Save class names
with open(os.path.join(MODELS_DIR, 'class_names.json'), 'w') as f:
    json.dump(class_names, f)

# Split val_test_ds into val_ds (10%) and test_ds (10%)
val_batches = tf.data.experimental.cardinality(val_test_ds)
val_ds = val_test_ds.take(val_batches // 2)
test_ds = val_test_ds.skip(val_batches // 2)

print(f"Train batches: {tf.data.experimental.cardinality(train_ds)}")
print(f"Validation batches: {tf.data.experimental.cardinality(val_ds)}")
print(f"Test batches: {tf.data.experimental.cardinality(test_ds)}")

# Compute class weights for imbalanced dataset
print("Extracting labels to compute class weights...")
train_labels = np.concatenate([y for x, y in train_ds], axis=0)
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_labels),
    y=train_labels
)
class_weight_dict = dict(enumerate(class_weights))
print(f"Class weights computed: {class_weight_dict}")

# Optimize datasets for performance
AUTOTUNE = tf.data.AUTOTUNE
# On Windows large numbers of concurrent file reads can exhaust system
# resources (ERROR 1450). Limit prefetch buffer to reduce simultaneous
# file handles and I/O concurrency. If you have plenty of memory/handles,
# you can raise this again or set to AUTOTUNE.
PREFETCH_SIZE = 1
train_ds = train_ds.shuffle(1000).prefetch(buffer_size=PREFETCH_SIZE)
val_ds = val_ds.prefetch(buffer_size=PREFETCH_SIZE)
test_ds = test_ds.prefetch(buffer_size=PREFETCH_SIZE)

# Data Augmentation Pipeline
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2)
], name="data_augmentation")

# ==========================================
# 3. Model Building (Transfer Learning)
# ==========================================
print("\n--- Phase B: Model Building (Frozen Backbone) ---")

# Preprocessing for MobileNetV2
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

# Load MobileNetV2 base model
base_model = tf.keras.applications.MobileNetV2(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights='imagenet'
)

# Freeze the backbone
base_model.trainable = False

# Build custom head
inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(num_classes, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)
model.summary()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE_FROZEN),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=['accuracy']
)

print(f"\nTraining for {EPOCHS_FROZEN} epochs with frozen backbone...")
history_frozen = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_FROZEN,
    class_weight=class_weight_dict
)

# ==========================================
# 4. Fine-Tuning
# ==========================================
print("\n--- Phase C: Fine-Tuning ---")

# Unfreeze base model
base_model.trainable = True

# Freeze all layers except the last 30
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE_UNFROZEN),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=['accuracy']
)

model.summary()

print(f"\nFine-tuning for {EPOCHS_UNFROZEN} epochs...")
history_finetune = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_FROZEN + EPOCHS_UNFROZEN,
    initial_epoch=history_frozen.epoch[-1] + 1,
    class_weight=class_weight_dict
)

# Save the final model
model_path = os.path.join(MODELS_DIR, 'plant_disease_model.keras')
model.save(model_path)
print(f"Model saved to {model_path}")

# ==========================================
# 5. Evaluation
# ==========================================
print("\n--- Phase D: Evaluation ---")

print("Evaluating on test dataset...")
loss, accuracy = model.evaluate(test_ds)
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")

# Get true labels and predictions
y_true = []
y_pred_probs = []

for x_batch, y_batch in test_ds:
    y_true.extend(y_batch.numpy())
    preds = model.predict(x_batch, verbose=0)
    y_pred_probs.extend(preds)

y_true = np.array(y_true)
y_pred = np.argmax(y_pred_probs, axis=1)

# Metrics calculation
acc = accuracy_score(y_true, y_pred)
prec = precision_score(y_true, y_pred, average='macro', zero_division=0)
rec = recall_score(y_true, y_pred, average='macro', zero_division=0)
f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)

print("\n--- Final Metrics ---")
print(f"Accuracy:  {acc:.4f}")
print(f"Precision: {prec:.4f}")
print(f"Recall:    {rec:.4f}")
print(f"F1 Score:  {f1:.4f}")

# Classification Report
report = classification_report(y_true, y_pred, target_names=class_names)
print("\nClassification Report:\n", report)

report_path = os.path.join(MODELS_DIR, 'classification_report.txt')
with open(report_path, 'w') as f:
    f.write(report)

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title('Confusion Matrix')
plt.tight_layout()

cm_path = os.path.join(MODELS_DIR, 'confusion_matrix.png')
plt.savefig(cm_path)
print(f"Confusion matrix saved to {cm_path}")

# Save training history
history_dict = {
    'frozen': history_frozen.history,
    'finetune': history_finetune.history
}
with open(os.path.join(MODELS_DIR, 'training_history.json'), 'w') as f:
    json.dump(history_dict, f)

print("Training pipeline completed successfully.")
