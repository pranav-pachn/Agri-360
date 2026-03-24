import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, Camera, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ 
  onImageSelect, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  disabled = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, or WebP images.');
      return false;
    }

    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit.`);
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file) => {
    setError(null);
    
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        file,
        preview: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      setSelectedImage(imageData);
      onImageSelect(imageData);
    };
    
    reader.readAsDataURL(file);
  }, [onImageSelect, maxSize, acceptedTypes]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    
    if (disabled) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled]);

  const removeImage = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept={acceptedTypes.join(',')}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {selectedImage ? (
        <div style={{ position: 'relative' }}>
          {/* Image Preview */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--border-color)',
            background: 'rgba(15, 23, 42, 0.4)'
          }}>
            <img
              src={selectedImage.preview}
              alt="Crop analysis preview"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            
            {/* Overlay with controls */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px'
            }}>
              {/* Top controls */}
              <div className="flex-between">
                <div style={{ 
                  background: 'rgba(0,0,0,0.6)', 
                  padding: '8px 12px', 
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <p style={{ 
                    color: 'white', 
                    fontSize: '0.875rem', 
                    margin: 0,
                    fontWeight: 500
                  }}>
                    {selectedImage.name}
                  </p>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.75rem', 
                    margin: '4px 0 0'
                  }}>
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                <button
                  onClick={removeImage}
                  disabled={disabled}
                  className="btn-primary"
                  style={{
                    background: 'rgba(211, 47, 47, 0.9)',
                    border: 'none',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Bottom indicator */}
              <div className="flex-center">
                <div style={{
                  background: 'rgba(46, 125, 50, 0.9)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ImageIcon size={16} />
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                    Image ready for analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className="flex-center"
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '48px 20px',
            flexDirection: 'column',
            gap: '16px',
            background: dragActive ? 'rgba(46, 125, 50, 0.05)' : 'rgba(15, 23, 42, 0.4)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.5 : 1,
            minHeight: '300px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <UploadCloud 
              size={48} 
              style={{ 
                color: dragActive ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'color 0.2s ease'
              }} 
            />
            <Camera 
              size={32} 
              style={{ 
                color: dragActive ? 'var(--primary)' : 'var(--text-muted)',
                opacity: 0.7,
                transition: 'color 0.2s ease'
              }} 
            />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontWeight: 600, 
              marginBottom: '4px',
              color: dragActive ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s ease'
            }}>
              {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm">
              JPEG, PNG or WebP (max. {(maxSize / 1024 / 1024).toFixed(0)}MB)
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            disabled={disabled}
            style={{
              background: 'transparent',
              border: '1px solid var(--primary)',
              color: 'var(--primary)'
            }}
          >
            Choose File
          </button>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(211, 47, 47, 0.1)',
          border: '1px solid rgba(211, 47, 47, 0.2)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger)',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {uploading && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(21, 101, 192, 0.1)',
          border: '1px solid rgba(21, 101, 192, 0.2)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--info)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div className="animate-pulse">Uploading image...</div>
        </div>
      )}
    </div>
  );
}
