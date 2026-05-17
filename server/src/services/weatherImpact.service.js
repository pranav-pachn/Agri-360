const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildNeutralWeatherImpact = (weather = null) => ({
  deltaPercent: 0,
  deltaScore: 0,
  direction: 'neutral',
  reason: weather?.available === false
    ? 'Live weather is unavailable, so a neutral weather impact was applied.'
    : 'Current weather conditions are contributing a neutral risk impact.',
  contributors: [],
});

const calculateWeatherImpact = (weather = null) => {
  if (!weather || weather.available === false) {
    return buildNeutralWeatherImpact(weather);
  }

  const temperatureC = Number(weather.temperatureC);
  const humidity = Number(weather.humidity);
  const windSpeed = Number(weather.windSpeed);

  let deltaScore = 0;
  const contributors = [];

  if (Number.isFinite(windSpeed)) {
    if (windSpeed >= 8) {
      deltaScore += 0.12;
      contributors.push('High wind speed increased crop vulnerability');
    } else if (windSpeed >= 5) {
      deltaScore += 0.08;
      contributors.push('Elevated wind speed added moderate field stress');
    } else if (windSpeed <= 2) {
      deltaScore -= 0.02;
      contributors.push('Calm wind conditions reduced immediate exposure stress');
    }
  }

  if (Number.isFinite(humidity)) {
    if (humidity >= 85) {
      deltaScore += 0.07;
      contributors.push('Very high humidity increased fungal and moisture pressure');
    } else if (humidity >= 75) {
      deltaScore += 0.05;
      contributors.push('High humidity added crop disease pressure');
    } else if (humidity >= 45 && humidity <= 65) {
      deltaScore -= 0.02;
      contributors.push('Balanced humidity helped stabilize crop conditions');
    } else if (humidity <= 30) {
      deltaScore += 0.04;
      contributors.push('Low humidity raised dryness stress on the crop');
    }
  }

  if (Number.isFinite(temperatureC)) {
    if (temperatureC >= 36) {
      deltaScore += 0.07;
      contributors.push('High temperature increased heat stress on the crop');
    } else if (temperatureC >= 32) {
      deltaScore += 0.04;
      contributors.push('Warm temperature slightly increased crop stress');
    } else if (temperatureC >= 22 && temperatureC <= 29) {
      deltaScore -= 0.02;
      contributors.push('Favorable temperature reduced near-term weather pressure');
    } else if (temperatureC <= 12) {
      deltaScore += 0.05;
      contributors.push('Low temperature increased cold stress on the crop');
    }
  }

  const boundedDeltaScore = clamp(Number(deltaScore.toFixed(3)), -0.1, 0.18);
  const deltaPercent = Math.round(boundedDeltaScore * 100);

  return {
    deltaPercent,
    deltaScore: boundedDeltaScore,
    direction: deltaPercent > 0 ? 'increase' : deltaPercent < 0 ? 'decrease' : 'neutral',
    reason: contributors[0] || 'Current weather conditions are contributing a neutral risk impact.',
    contributors,
  };
};

module.exports = {
  calculateWeatherImpact,
  buildNeutralWeatherImpact,
};
