/**
 * Compatibility wrapper for the production-safe hybrid inference engine.
 *
 * Older services import this module as the fallback path when TensorFlow.js is
 * unavailable. Keep that contract, but route it to dynamic image heuristics so
 * uploads no longer collapse into static mock predictions.
 */

const hybridInference = require('./hybrid-inference-service');

module.exports = {
  analyzeCropImage: hybridInference.analyzeCropImage,
  analyzeBatch: (imageUrls = [], cropType, location) =>
    Promise.all(imageUrls.map((url) => hybridInference.analyzeCropImage(url, cropType, location))),
};
