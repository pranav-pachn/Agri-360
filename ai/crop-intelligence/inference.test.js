const { runTensorflow, runInference } = require('./inference');

jest.mock('./cropMapping', () => ({
  mapToCropDisease: jest.fn((label) => {
    if (label.includes('fungus')) {
      return { crop: 'Unknown', disease: 'Fungal Infection', severity: 'High', health_score: 40, advice: 'Fungicide', confidence_boost: 0.05 };
    }
    return { crop: 'Generic Plant', disease: 'Healthy', severity: 'None', health_score: 95, advice: 'Looking good' };
  })
}));

jest.mock('./agriEnhancer', () => ({
  enhancePrediction: jest.fn((result) => ({ ...result, enhanced: true, riskFactor: 1.1 }))
}));

describe('inference engine', () => {
  describe('runTensorflow', () => {
    it('normalizes predictions payload', () => {
      const preds = [
        { className: 'plant, fungus', probability: 0.85 },
        { className: 'leaf', probability: 0.1 }
      ];
      const result = runTensorflow(preds);
      expect(result.label).toBe('plant, fungus');
      expect(result.probability).toBe(0.85);
      expect(result.alternatives).toHaveLength(1);
    });

    it('handles empty predictions', () => {
      const result = runTensorflow([]);
      expect(result.label).toBeNull();
    });
  });

  describe('runInference', () => {
    it('blocks non-agricultural images', () => {
      const preds = [{ className: 'car, automobile', probability: 0.99 }];
      const result = runInference(preds);
      expect(result.error).toBe('NON_AGRICULTURAL_IMAGE');
    });

    it('rejects low confidence predictions', () => {
      const preds = [{ className: 'plant', probability: 0.2 }];
      const result = runInference(preds);
      expect(result.error).toBe('LOW_CONFIDENCE');
    });

    it('processes valid agricultural predictions', () => {
      const preds = [{ className: 'fungus, plant', probability: 0.8 }];
      const result = runInference(preds);
      expect(result.disease).toBe('Fungal Infection');
      expect(result.severity).toBe('High');
      expect(result.confidence).toBeCloseTo(0.85); // 0.8 + 0.05 boost
    });
  });
});
