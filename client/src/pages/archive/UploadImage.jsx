import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Leaf, MapPin, Camera, CheckCircle } from 'lucide-react';
import ImageUpload from '../components/ui/ImageUpload';

export default function UploadImage() {
  const navigate = useNavigate();
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Image upload, 2: Details, 3: Processing
  const [fertilizerLevel, setFertilizerLevel] = useState('medium'); // NEW: Fertilizer level input

  // Common crop suggestions — user can still type any custom crop
  const CROP_SUGGESTIONS = [
    'Corn (Maize)', 'Wheat', 'Rice', 'Tomato', 'Potato', 'Cotton',
    'Soybean', 'Barley', 'Millet', 'Sorghum', 'Sugarcane', 'Groundnut',
    'Sunflower', 'Mustard', 'Chickpea', 'Lentil', 'Onion', 'Garlic',
    'Chili', 'Brinjal', 'Cauliflower', 'Cabbage', 'Spinach', 'Banana',
    'Mango', 'Papaya', 'Orange', 'Grapes', 'Turmeric', 'Ginger'
  ];

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
    if (imageData) {
      setStep(2);
    } else {
      setStep(1);
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop || !location || !selectedImage) {
      setError("Please complete all steps before proceeding.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep(3);

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', selectedImage.file);
      formData.append('crop', crop);
      formData.append('location', location);
      formData.append('fertilizerLevel', fertilizerLevel); // NEW: Include fertilizer level
      formData.append('farmer_id', 'demo-user'); // Would come from auth context

      // Upload image and get analysis
      const result = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate(`/result/${result.id}`);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      setStep(2);
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container animate-fade" style={{ maxWidth: '900px' }}>
      <button 
        onClick={goBack} 
        className="btn-primary" 
        style={{ background: 'transparent', padding: '0', color: 'var(--text-muted)', marginBottom: '32px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Progress Indicator */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step >= stepNumber ? 'var(--primary)' : 'rgba(148, 163, 184, 0.1)',
                  color: step >= stepNumber ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                {stepNumber}
              </div>
              <span style={{ 
                fontSize: '0.875rem', 
                color: step >= stepNumber ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: step >= stepNumber ? 500 : 400
              }}>
                {stepNumber === 1 ? 'Upload' : stepNumber === 2 ? 'Details' : 'Processing'}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{ 
          height: '2px', 
          background: 'rgba(148, 163, 184, 0.1)', 
          borderRadius: '1px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${(step / 3) * 100}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <div className="glass-panel">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="heading-lg" style={{ marginBottom: '8px' }}>Crop Intelligence Analysis</h1>
          <p className="text-body">
            {step === 1 && "Upload a clear image of your crop for AI-powered disease detection and health analysis."}
            {step === 2 && "Provide additional details to enhance your analysis accuracy."}
            {step === 3 && "Our AI is analyzing your crop image and generating insights..."}
          </p>
        </div>

        {step === 1 && (
          <div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              maxSize={10 * 1024 * 1024}
              className="animate-fade"
            />
            
            <div style={{ 
              marginTop: '24px', 
              padding: '16px',
              background: 'rgba(21, 101, 192, 0.1)',
              border: '1px solid rgba(21, 101, 192, 0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Camera size={20} />
              <div>
                <strong>Pro tip:</strong> Capture images in good lighting with the entire plant visible for best results.
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="animate-fade">
            <div style={{ marginBottom: '32px' }}>
              <h3 className="heading-md" style={{ marginBottom: '16px' }}>Crop Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="input-label">Crop Type</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input-field"
                      list="crop-suggestions"
                      placeholder="e.g. Tomato, Soybean, Barley..."
                      value={crop}
                      onChange={e => setCrop(e.target.value)}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <datalist id="crop-suggestions">
                      {CROP_SUGGESTIONS.map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <Leaf size={18} style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Farm Location</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Punjab, India"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <MapPin size={18} style={{ 
                      position: 'absolute', 
                      left: '16px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: 'var(--text-muted)' 
                    }} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Fertilizer Usage Level</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="input-field"
                      value={fertilizerLevel}
                      onChange={e => setFertilizerLevel(e.target.value)}
                      style={{ paddingLeft: '16px' }}
                    >
                      <option value="low">🟢 Low (Sustainable)</option>
                      <option value="medium">🟡 Medium (Standard)</option>
                      <option value="high">🔴 High (Intensive)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview Summary */}
            {selectedImage && (
              <div style={{ 
                marginBottom: '32px',
                padding: '16px',
                background: 'rgba(46, 125, 50, 0.1)',
                border: '1px solid rgba(46, 125, 50, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Image Ready</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {selectedImage.name} • {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ 
                color: 'var(--danger)', 
                fontSize: '0.875rem', 
                marginBottom: '24px',
                padding: '12px',
                background: 'rgba(211, 47, 47, 0.1)',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                borderRadius: 'var(--radius-md)'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="btn-primary"
                style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Generate Trust Score'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="animate-fade" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="animate-pulse" style={{ marginBottom: '24px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                border: '4px solid var(--primary)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            
            <h3 className="heading-md" style={{ marginBottom: '12px' }}>AI Analysis in Progress</h3>
            <p className="text-body" style={{ marginBottom: '16px' }}>
              Our advanced AI models are analyzing your crop image for:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left' }}>
              <div className="health-card healthy">
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>🔍 Disease Detection</div>
                <div className="text-sm">Identifying potential diseases and pest infestations</div>
              </div>
              <div className="health-card warning">
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>📊 Health Assessment</div>
                <div className="text-sm">Calculating crop health score and vitality</div>
              </div>
              <div className="health-card healthy">
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>💰 Trust Score</div>
                <div className="text-sm">Generating financial credibility score</div>
              </div>
            </div>
            
            {loading && (
              <div style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                This usually takes 3-5 seconds...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
