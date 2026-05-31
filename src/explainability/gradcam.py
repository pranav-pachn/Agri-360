import os
import json
import base64
import random
import glob
import numpy as np
import tensorflow as tf
import cv2

class GradCAM:
    def __init__(self, model_path, class_names_path):
        """
        Initialize the Grad-CAM explainer.
        """
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        if not os.path.exists(class_names_path):
            raise FileNotFoundError(f"Class names not found at {class_names_path}")
            
        print(f"Loading model from {model_path}...")
        self.model = tf.keras.models.load_model(model_path, compile=False)
        
        with open(class_names_path, 'r') as f:
            self.class_names = json.load(f)
            
        # Find the embedded MobileNetV2 base model
        self.base_model = None
        for layer in self.model.layers:
            if isinstance(layer, tf.keras.Model) and layer.name != 'data_augmentation':
                self.base_model = layer
                break
                
        if self.base_model is None:
            raise ValueError("Could not find the base MobileNetV2 model inside the loaded model.")
            
        # Create a sub-model that outputs both the last conv layer and the base model's final output
        # MobileNetV2's last conv layer is typically 'out_relu'
        try:
            last_conv_layer = self.base_model.get_layer('out_relu')
        except ValueError:
            # Fallback if layer is named differently
            last_conv_layer = self.base_model.layers[-1]
            
        self.grad_base = tf.keras.Model(
            inputs=self.base_model.inputs, 
            outputs=[last_conv_layer.output, self.base_model.output]
        )

    def _call_layer(self, layer, tensor, training=False):
        """Call a Keras layer while tolerating layers that do not accept `training`."""
        try:
            return layer(tensor, training=training)
        except TypeError:
            return layer(tensor)

    def _forward_pass(self, img_tensor):
        """
        Runs the forward pass up to the conv layer, and then through the rest of the network.
        Returns the conv layer outputs and final predictions.
        """
        x = img_tensor
        
        # 1. Pre-base model layers (Data Augmentation, Preprocessing)
        for layer in self.model.layers:
            if isinstance(layer, tf.keras.layers.InputLayer):
                continue
            if layer == self.base_model:
                break
            x = self._call_layer(layer, x, training=False)
            
        # 2. Base model split pass
        with tf.GradientTape() as tape:
            conv_outputs, base_outputs = self.grad_base(x, training=False)
            tape.watch(conv_outputs)
            
            # 3. Post-base model layers (GlobalAveragePooling, Dropout, Dense)
            y = base_outputs
            found_base = False
            for layer in self.model.layers:
                if isinstance(layer, tf.keras.layers.InputLayer):
                    continue
                if layer == self.base_model:
                    found_base = True
                    continue
                if found_base:
                    y = self._call_layer(layer, y, training=False)
            
            preds = y
            top_class_idx = tf.argmax(preds[0])
            top_class_score = preds[0, top_class_idx]
            
        return conv_outputs, preds, top_class_idx, top_class_score, tape

    def generate_heatmap(self, img_array):
        """
        Generates the Grad-CAM heatmap for a given image array.
        """
        img_tensor = tf.convert_to_tensor(img_array)
        if len(img_tensor.shape) == 3:
            img_tensor = tf.expand_dims(img_tensor, 0)
            
        # Get forward pass and gradient tape
        conv_outputs, preds, top_class_idx, top_class_score, tape = self._forward_pass(img_tensor)
        
        # Calculate gradients of the top class score w.r.t the conv layer feature maps
        grads = tape.gradient(top_class_score, conv_outputs)
        
        # Pool the gradients over spatial dimensions (GlobalAveragePooling of gradients)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Multiply each channel in the feature map array by its gradient importance
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        
        # Apply ReLU to keep only features that have a positive influence on the class
        heatmap = tf.maximum(heatmap, 0)
        
        # Normalize the heatmap between 0 and 1
        max_val = tf.math.reduce_max(heatmap)
        if max_val != 0:
            heatmap = heatmap / max_val
            
        return heatmap.numpy(), top_class_idx.numpy(), top_class_score.numpy()

    def overlay_heatmap_from_array(self, heatmap, original_image_bgr, alpha=0.4):
        """
        Overlays the generated heatmap onto an already loaded BGR numpy array.
        """
        img = original_image_bgr
        # Resize heatmap to match original image dimensions
        heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        
        # Convert heatmap to RGB/JET colormap
        heatmap_resized = np.uint8(255 * heatmap_resized)
        heatmap_colored = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
        
        # Superimpose the heatmap on the original image
        overlay = cv2.addWeighted(heatmap_colored, alpha, img, 1 - alpha, 0)
        
        return overlay

    def overlay_heatmap(self, heatmap, original_image_path, alpha=0.4):
        """
        Overlays the generated heatmap onto the original image file.
        """
        # Load the original image with OpenCV
        img = cv2.imread(original_image_path)
        if img is None:
            raise ValueError(f"Could not load image at {original_image_path}")
            
        return self.overlay_heatmap_from_array(heatmap, img, alpha)

    def explain_from_array(self, img_array_rgb):
        """
        End-to-end explanation pipeline directly from a loaded numpy array (RGB).
        Generates heatmap, applies overlay, and returns JSON.
        """
        # Generate Grad-CAM heatmap (expects a single image array, not batch)
        heatmap, class_idx, confidence = self.generate_heatmap(img_array_rgb)
        disease_name = self.class_names[class_idx]
        
        # Convert RGB to BGR for OpenCV overlay
        img_bgr = cv2.cvtColor(np.uint8(img_array_rgb), cv2.COLOR_RGB2BGR)
        
        # Overlay heatmap on the image
        overlay_img = self.overlay_heatmap_from_array(heatmap, img_bgr)
        
        # Encode overlay to base64 for API transmission
        _, buffer = cv2.imencode('.png', overlay_img)
        base64_heatmap = base64.b64encode(buffer).decode('utf-8')
        
        result = {
            "disease": disease_name,
            "confidence": float(confidence),
            "class_index": int(class_idx),
            "heatmap_base64": f"data:image/png;base64,{base64_heatmap}"
        }
        return result

    def explain(self, image_path, output_dir=None):
        """
        End-to-end explanation pipeline. Generates heatmap, applies overlay, and returns JSON.
        """
        # Load and resize for the model input
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        
        # Generate Grad-CAM heatmap
        heatmap, class_idx, confidence = self.generate_heatmap(img_array)
        disease_name = self.class_names[class_idx]
        
        # Overlay heatmap on the original, high-res image
        overlay_img = self.overlay_heatmap(heatmap, image_path)
        
        # Encode overlay to base64 for API transmission
        _, buffer = cv2.imencode('.png', overlay_img)
        base64_heatmap = base64.b64encode(buffer).decode('utf-8')
        
        result = {
            "disease": disease_name,
            "confidence": float(confidence),
            "class_index": int(class_idx),
            "heatmap_base64": f"data:image/png;base64,{base64_heatmap}"
        }
        
        # Save to disk if requested
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            base_name = os.path.basename(image_path).split('.')[0]
            out_path = os.path.join(output_dir, f"overlay_{disease_name.replace(' ', '_')}_{base_name}.png")
            cv2.imwrite(out_path, overlay_img)
            result["overlay_path"] = out_path
            
        return result

def run_demo():
    print("Running Grad-CAM Demo Mode...")
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    model_path = os.path.join(base_dir, 'models', 'plant_disease_model.keras')
    class_names_path = os.path.join(base_dir, 'models', 'class_names.json')
    data_dir = os.path.join(base_dir, 'ai', 'data', 'PlantVillage')
    output_dir = os.path.join(base_dir, 'models', 'gradcam')
    
    explainer = GradCAM(model_path, class_names_path)
    
    # Pick a few random classes to demo
    demo_classes = random.sample(explainer.class_names, min(5, len(explainer.class_names)))
    
    for class_name in demo_classes:
        class_dir = os.path.join(data_dir, class_name)
        images = glob.glob(os.path.join(class_dir, '*.jpg')) + glob.glob(os.path.join(class_dir, '*.JPG'))
        
        if not images:
            print(f"No images found for {class_name}, skipping.")
            continue
            
        sample_img = random.choice(images)
        print(f"\nProcessing {sample_img}...")
        
        result = explainer.explain(sample_img, output_dir=output_dir)
        print(f"Predicted: {result['disease']} ({result['confidence']*100:.1f}%)")
        print(f"Overlay saved to: {result['overlay_path']}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Grad-CAM Explainability Tool")
    parser.add_argument("--image", type=str, help="Path to image for single inference")
    parser.add_argument("--demo", action="store_true", help="Run batch demo mode on PlantVillage")
    
    args = parser.parse_args()
    
    if args.demo:
        run_demo()
    elif args.image:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        model_path = os.path.join(base_dir, 'models', 'plant_disease_model.keras')
        class_names_path = os.path.join(base_dir, 'models', 'class_names.json')
        output_dir = os.path.join(base_dir, 'models', 'gradcam')
        
        explainer = GradCAM(model_path, class_names_path)
        res = explainer.explain(args.image, output_dir=output_dir)
        print(json.dumps({k: v for k, v in res.items() if k != 'heatmap_base64'}, indent=2))
    else:
        parser.print_help()
