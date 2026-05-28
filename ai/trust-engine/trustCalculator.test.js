const { calculateTrustScore, scaleTrustScoreToCreditBand, getRating, clamp } = require('./trustCalculator');

jest.mock('./sustainabilityEngine.js', () => ({
  calculateSustainability: jest.fn(() => ({ score: 80 }))
}));

describe('trustCalculator', () => {
  describe('clamp', () => {
    it('keeps values between 0 and 100', () => {
      expect(clamp(150)).toBe(100);
      expect(clamp(-10)).toBe(0);
      expect(clamp(50)).toBe(50);
      expect(clamp(null)).toBe(0);
    });
  });

  describe('getRating', () => {
    it('returns Excellent for >= 80', () => expect(getRating(85)).toBe('Excellent'));
    it('returns Good for >= 65', () => expect(getRating(70)).toBe('Good'));
    it('returns Moderate for >= 50', () => expect(getRating(55)).toBe('Moderate'));
    it('returns High Risk for < 50', () => expect(getRating(40)).toBe('High Risk'));
  });

  describe('calculateTrustScore', () => {
    it('calculates weighted score correctly', () => {
      const result = calculateTrustScore({
        yieldStability: 80,
        riskTrend: 90,
        sustainability: 70,
        consistency: 85
      });
      
      // 0.3*80 + 0.25*90 + 0.2*70 + 0.25*85
      // 24 + 22.5 + 14 + 21.25 = 81.75 -> round to 82
      expect(result.trustScore).toBe(82);
      expect(result.rating).toBe('Excellent');
      expect(result.inputs.ys).toBe(80);
    });
  });

  describe('scaleTrustScoreToCreditBand', () => {
    it('scales a 0-100 score to a 300-900 band', () => {
      expect(scaleTrustScoreToCreditBand(0)).toBe(300);
      expect(scaleTrustScoreToCreditBand(100)).toBe(900);
      expect(scaleTrustScoreToCreditBand(50)).toBe(600);
    });
  });
});
