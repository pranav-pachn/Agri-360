const supabase = require('../config/supabase');
const crypto = require('crypto');

class StorageService {
    async uploadCropImage(fileBuffer, originalName, mimeType) {
        try {
            // Enhanced validation
            if (!fileBuffer || !originalName || !mimeType) {
                throw new Error('Missing required parameters: fileBuffer, originalName, mimeType');
            }
            
            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (fileBuffer.length > maxSize) {
                throw new Error('File size exceeds 5MB limit');
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(mimeType)) {
                throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
            }
            
            // Generate unique filename with timestamp and UUID
            const timestamp = Date.now();
            const uuid = crypto.randomUUID();
            const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${uuid}_${safeName}`;
            
            // Enhanced upload with metadata
            const { data, error } = await supabase.storage
                .from('crop-images')
                .upload(fileName, fileBuffer, {
                    contentType: mimeType,
                    cacheControl: '3600',
                    upsert: false,
                    metadata: {
                        original_name: originalName,
                        upload_timestamp: timestamp,
                        file_size: fileBuffer.length,
                        mime_type: mimeType
                    }
                });
            
            if (error) {
                console.error("Supabase Storage Error:", error);
                throw new Error(`Failed to upload image: ${error.message}`);
            }
            
            // Retrieve public URL with error handling
            const { data: publicUrlData } = await supabase.storage
                .from('crop-images')
                .getPublicUrl(fileName);
            
            if (!publicUrlData?.publicUrl) {
                throw new Error('Failed to retrieve public URL');
            }
            
            console.log(`Image uploaded successfully: ${publicUrlData.publicUrl}`);
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Storage Service Exception:", error);
            throw error;
        }
    }
    
    async deleteImage(imageUrl) {
        try {
            // Extract filename from URL
            const fileName = imageUrl.split('/').pop();
            
            if (!fileName) {
                throw new Error('Invalid image URL provided');
            }
            
            const { error } = await supabase.storage
                .from('crop-images')
                .remove([fileName]);
            
            if (error) {
                console.error("Storage deletion error:", error);
                throw new Error(`Failed to delete image: ${error.message}`);
            }
            
            console.log(`Image deleted successfully: ${fileName}`);
            return true;
        } catch (error) {
            console.error("Storage Service Exception:", error);
            throw error;
        }
    }
    
    // Basic image validation
    async validateImageFile(fileBuffer, originalName, mimeType) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        const isValid = fileBuffer.length <= maxSize && 
                        allowedTypes.includes(mimeType) && 
                        originalName.length > 0;
        
        return {
            isValid,
            errors: isValid ? [] : this.getValidationErrors(fileBuffer, originalName, mimeType)
        };
    }
    
    getValidationErrors(fileBuffer, originalName, mimeType) {
        const errors = [];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (fileBuffer.length > maxSize) {
            errors.push('File size exceeds 5MB limit');
        }
        
        if (!allowedTypes.includes(mimeType)) {
            errors.push('Invalid file type. Only JPEG, PNG, and WebP are allowed');
        }
        
        if (!originalName || originalName.trim().length === 0) {
            errors.push('File name is required');
        }
        
        return errors;
    }
}

module.exports = new StorageService();
