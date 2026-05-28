const { calculateRisk, getRiskLevel } = require('./riskCalculator');

describe('riskCalculator', () => {
  describe('getRiskLevel', () => {
    it('returns High Risk for score > 0.7', () => {
      expect(getRiskLevel(0.75)).toBe('High Risk');
    });

    it('returns Medium Risk for score >= 0.4', () => {
      expect(getRiskLevel(0.5)).toBe('Medium Risk');
      expect(getRiskLevel(0.4)).toBe('Medium Risk');
    });

    it('returns Low Risk for score < 0.4', () => {
      expect(getRiskLevel(0.3)).toBe('Low Risk');
    });
  });

  describe('calculateRisk', () => {
    it('calculates risk score based on inputs', () => {
      const result = calculateRisk({
        confidence: 0.9,
        severity: 'High',
        weather: { temp: 35, humidity: 80 }
      });
      expect(result.riskScore).toBeDefined();
      expect(result.riskLevel).toBeDefined();
      expect(result.weatherFactor).toBeDefined();
      expect(result.severityWeight).toBeDefined();
    });

    it('clamps risk score to 1.0 maximum', () => {
      // Mocking a scenario where risk > 1.0
      // Assuming High severity weight is high and confidence is 1.0, and bad weather factor
      // This is a bounds test, the logic Math.min(x, 1.0) ensures this.
      const result = calculateRisk({
        confidence: 1.0,
        severity: 'Critical',
        weather: { temp: 45, humidity: 10 }
      });
      expect(result.riskScore).toBeLessThanOrEqual(1.0);
    });

    it('normalizes negative or invalid confidence to 0', () => {
      const result = calculateRisk({
        confidence: -0.5,
        severity: 'Low',
        weather: {}
      });
      expect(result.riskScore).toBe(0);
    });
  });
});
