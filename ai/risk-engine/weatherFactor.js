/**
 * Weather Factor - Risk Engine
 * Simple weather multiplier logic (MVP).
 *
 * NOTE:
 * Later can be wired to live weather APIs (IMD/OpenWeather).
 */

const getWeatherFactor = (weather) => {
  // weather can be: "dry", "normal", "humid", "rainy"
  switch (String(weather || '').toLowerCase()) {
    case 'dry':
      return 0.8;

    case 'normal':
      return 1.0;

    case 'humid':
    case 'rainy':
      return 1.2;

    default:
      return 1.0;
  }
};

module.exports = {
  getWeatherFactor
};
