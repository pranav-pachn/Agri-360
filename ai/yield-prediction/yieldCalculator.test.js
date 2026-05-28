const { calculateProjectedYield } = require('./yieldCalculator');

describe('yieldCalculator', () => {
  describe('calculateProjectedYield', () => {
    it('calculates projected yield using default impact factor (0.5)', () => {
      const result = calculateProjectedYield({
        baseYield: 10,
        riskScore: 0.4,
        crop: 'wheat'
      });
      
      // 10 * (1 - 0.4 * 0.5) = 10 * (1 - 0.2) = 10 * 0.8 = 8
      expect(result.projectedYield).toBe(8);
      expect(result.yieldLossPercent).toBe(20);
      expect(result.impactFactor).toBe(0.5);
    });

    it('uses a specific impact factor for rice (0.6)', () => {
      const result = calculateProjectedYield({
        baseYield: 10,
        riskScore: 0.5,
        crop: 'rice'
      });
      
      // 10 * (1 - 0.5 * 0.6) = 10 * (1 - 0.3) = 7
      expect(result.projectedYield).toBe(7);
      expect(result.yieldLossPercent).toBe(30);
      expect(result.impactFactor).toBe(0.6);
    });

    it('handles negative or missing riskScore securely', () => {
      const result = calculateProjectedYield({
        baseYield: 5,
        riskScore: -1,
        crop: 'corn'
      });
      expect(result.projectedYield).toBe(5); // Risk clamped to 0
    });

    it('clamps riskScore to 1 maximum', () => {
      const result = calculateProjectedYield({
        baseYield: 10,
        riskScore: 1.5,
        crop: 'corn'
      });
      // 10 * (1 - 1 * 0.5) = 5
      expect(result.projectedYield).toBe(5);
    });
  });
});
