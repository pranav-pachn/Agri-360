const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

class MLService {
    async downloadImage(imageUrl) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            return Buffer.from(response.data, 'binary');
        } catch (error) {
            logger.error(`Failed to download image from ${imageUrl}: ${error.message}`);
            return null;
        }
    }

    async predict(imageUrl, withExplanation = false) {
        try {
            const imageBuffer = await this.downloadImage(imageUrl);
            if (!imageBuffer) return null;

            const form = new FormData();
            form.append('file', imageBuffer, 'image.jpg');

            const endpoint = withExplanation ? '/predict-with-explanation' : '/predict';
            const url = `${ML_SERVICE_URL}${endpoint}`;
            
            logger.info(`Calling custom ML service at ${url}`);
            
            const response = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders()
                },
                timeout: withExplanation ? 20000 : 10000 // 20s for GradCAM, 10s for normal predict
            });

            return response.data;
        } catch (error) {
            logger.error(`ML Service Error at ${ML_SERVICE_URL}: ${error.message}`);
            return null; // Return null to allow fallback to other AI providers
        }
    }

    async healthCheck() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
            return response.data;
        } catch (error) {
            return { status: "unreachable", model_loaded: false };
        }
    }
}

module.exports = new MLService();
