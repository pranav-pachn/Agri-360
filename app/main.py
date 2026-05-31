import os
import io
import json
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import tensorflow as tf

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.explainability.gradcam import GradCAM

# Configuration paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'plant_disease_model.keras')
CLASS_NAMES_PATH = os.path.join(BASE_DIR, 'models', 'class_names.json')

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to load the ML model and Grad-CAM explainer
    only once when the server starts up.
    """
    print("Starting up FastAPI Inference Service...")
    if not os.path.exists(MODEL_PATH) or not os.path.exists(CLASS_NAMES_PATH):
        print(f"ERROR: Model or class names not found in {BASE_DIR}/models/")
        yield
        return
        
    try:
        # We load the explainer, which internally loads the model
        app.state.explainer = GradCAM(MODEL_PATH, CLASS_NAMES_PATH)
        app.state.model = app.state.explainer.model
        app.state.class_names = app.state.explainer.class_names
        app.state.model_loaded = True
        print(f"Successfully loaded model with {len(app.state.class_names)} classes.")
    except Exception as e:
        print(f"Failed to load model: {e}")
        app.state.model_loaded = False
        
    yield
    print("Shutting down FastAPI Inference Service...")
    # Clean up resources if necessary
    app.state.explainer = None
    app.state.model = None

# Initialize FastAPI app
app = FastAPI(
    title="Agri-360 Inference API",
    description="Python-native inference service for the trained MobileNetV2 plant disease model.",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware to allow the existing Express.js server to call this if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_image_upload(file: UploadFile):
    """
    Helper function to read an uploaded image, convert it to RGB,
    resize it to (224, 224), and convert to a numpy array.
    """
    try:
        content = file.file.read()
        image = Image.open(io.BytesIO(content)).convert('RGB')
        image = image.resize((224, 224))
        img_array = np.array(image)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

@app.get("/health")
async def health_check():
    """Returns the health status of the API and whether the model is loaded."""
    is_loaded = getattr(app.state, 'model_loaded', False)
    return {
        "status": "healthy" if is_loaded else "degraded",
        "model_loaded": is_loaded
    }

@app.get("/model-info")
async def model_info():
    """Returns metadata about the loaded model."""
    if not getattr(app.state, 'model_loaded', False):
        raise HTTPException(status_code=503, detail="Model not loaded")
        
    class_names = app.state.class_names
    input_shape = app.state.model.input_shape
    
    # Try to load training history for metrics
    history_path = os.path.join(BASE_DIR, 'models', 'training_history.json')
    metrics = {}
    if os.path.exists(history_path):
        try:
            with open(history_path, 'r') as f:
                history = json.load(f)
                if 'finetune' in history:
                    metrics['final_accuracy'] = history['finetune']['accuracy'][-1]
                    metrics['final_val_accuracy'] = history['finetune']['val_accuracy'][-1]
        except Exception:
            pass
            
    return {
        "model_name": "MobileNetV2 Custom Top",
        "input_shape": input_shape,
        "num_classes": len(class_names),
        "classes": class_names,
        "metrics": metrics
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image and returns the top predicted class and confidence,
    along with the top 3 predictions.
    """
    if not getattr(app.state, 'model_loaded', False):
        raise HTTPException(status_code=503, detail="Model not loaded")
        
    img_array = process_image_upload(file)
    
    # Add batch dimension
    img_batch = np.expand_dims(img_array, axis=0)
    
    # Predict
    preds = app.state.model.predict(img_batch, verbose=0)[0]
    
    # Get top 3 predictions
    top_indices = np.argsort(preds)[-3:][::-1]
    
    top_predictions = [
        {
            "class": app.state.class_names[i],
            "confidence": float(preds[i])
        }
        for i in top_indices
    ]
    
    best_idx = top_indices[0]
    
    return JSONResponse(content={
        "disease": app.state.class_names[best_idx],
        "confidence": float(preds[best_idx]),
        "class_index": int(best_idx),
        "top_predictions": top_predictions
    })

@app.post("/predict-with-explanation")
async def predict_with_explanation(file: UploadFile = File(...)):
    """
    Accepts an image and returns the prediction along with a base64 encoded
    Grad-CAM heatmap overlay.
    """
    if not getattr(app.state, 'model_loaded', False):
        raise HTTPException(status_code=503, detail="Model not loaded")
        
    img_array = process_image_upload(file)
    
    try:
        # Use the explainer directly on the loaded array
        explanation = app.state.explainer.explain_from_array(img_array)
        
        # We can still append the top predictions by running a regular predict
        # (Though we could extract this from the explain pass, doing it again is fast enough)
        img_batch = np.expand_dims(img_array, axis=0)
        preds = app.state.model.predict(img_batch, verbose=0)[0]
        top_indices = np.argsort(preds)[-3:][::-1]
        top_predictions = [
            {"class": app.state.class_names[i], "confidence": float(preds[i])}
            for i in top_indices
        ]
        
        explanation["top_predictions"] = top_predictions
        
        return JSONResponse(content=explanation)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
