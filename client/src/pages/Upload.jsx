import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadBox from '../components/upload/UploadBox';
import ImagePreview from '../components/upload/ImagePreview';
import AnalyzeButton from '../components/upload/AnalyzeButton';
import LoadingOverlay from '../components/upload/LoadingOverlay';
import { buildFallbackResultPayload, normalizeResultPayload } from '../services/resultDataMapper';

const CROP_OPTIONS = [
  "Apple", "Banana", "Barley", "Black Pepper", "Cabbage", 
  "Cardamom", "Carrot", "Cashew", "Cauliflower", "Chili", 
  "Coffee", "Cotton", "Garlic", "Ginger", "Gram", 
  "Grapes", "Groundnut", "Jute", "Lemon", "Maize", 
  "Mango", "Mustard", "Onion", "Orange", "Papaya", 
  "Peas", "Potato", "Rice", "Rubber", "Soybean", 
  "Sugarcane", "Sunflower", "Tea", "Tomato", "Turmeric", "Wheat"
];

const Upload = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Additional form state
  const [cropType, setCropType] = useState('');
  const [fertilizerUsage, setFertilizerUsage] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewURL(objectUrl);
    setAnalysisResult(null); // Reset previous results if any
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    
    setLoading(true);

    try {
      // --- REAL API CALL ---
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop', cropType);
      formData.append('location', farmLocation || 'Maharashtra');
      formData.append('fertilizerUsage', fertilizerUsage || 'medium');
      if (user?.id) {
        formData.append('farmerId', user.id);
      }

      let analysisData;

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const json = await response.json();
        const d = json.data;

        analysisData = normalizeResultPayload(d, {
          image: previewURL,
        });
      } catch (apiError) {
        console.warn('Real API failed, using mock data:', apiError.message);
        analysisData = buildFallbackResultPayload({
          id: `mock-${Date.now()}`,
          image: previewURL,
          crop: cropType,
          location: farmLocation || 'Maharashtra',
        });
      }

      const resultId = analysisData.id || Date.now().toString();
      navigate(`/result/${resultId}`, { state: { analysisData } });
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Crop Diagnostics
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Upload a clear image of your crop to detect diseases and assess health.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-700/50 p-6 sm:p-8 space-y-6">
          
          {!previewURL ? (
            <UploadBox onFileSelect={handleFileSelect} />
          ) : (
            <ImagePreview 
              previewURL={previewURL} 
              fileName={imageFile?.name} 
              onRemove={handleRemoveImage} 
            />
          )}

          {/* Additional Analysis Details */}
          <div className="space-y-4 bg-slate-800/50 p-1 rounded-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Crop Type</label>
              <input 
                list="crop-options"
                type="text" 
                placeholder="Select or type a crop..."
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/80 transition-all shadow-inner"
              />
              <datalist id="crop-options">
                {CROP_OPTIONS.map((crop) => (
                  <option key={crop} value={crop} />
                ))}
              </datalist>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maharashtra, Punjab..."
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/80 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Fertilizer Usage</label>
                <div className="relative">
                  <select 
                    value={fertilizerUsage}
                    onChange={(e) => setFertilizerUsage(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/80 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-500">Select intensity...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnalyzeButton 
            disabled={!previewURL || loading || !cropType} 
            onClick={handleAnalyze} 
          />
          
          {/* Temporary Results Placeholder */}
          {analysisResult && !loading && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-green-400 text-center font-medium">
                {analysisResult.status}
              </p>
            </div>
          )}

        </div>
      </div>

      <LoadingOverlay isVisible={loading} />
      
      {/* Background gradients for visual depth */}
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center overflow-hidden z-0">
        <div className="w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] absolute -top-20 -left-20"></div>
        <div className="w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] absolute -bottom-20 -right-20"></div>
      </div>
    </div>
  );
};

export default Upload;
