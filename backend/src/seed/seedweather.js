// Demo / seed data.
//
// When no OpenWeatherMap API key is configured (or the placeholder is
// still in .env), the weather service serves these realistic records
// instead of calling the live API. This lets the app be demoed, tested
// and reviewed end-to-end without a key. Every demo response is flagged
// with `"demo": true` so it is never mistaken for live data.
//
// Shape matches the normalised live response exactly (see weatherService).
const seedCities = {
  london: {
    city: 'London',
    country: 'GB',
    current: {
      temp: 14.2,
      feels_like: 12.8,
      condition: 'Clouds',
      description: 'overcast clouds',
      icon: '04d',
      humidity: 72,
      pressure: 1015,
      wind_speed: 4.6,
      sunrise: 1763602800,
      sunset: 1763635200,
      dt: 1763620800,
    },
    forecast: [
      { date: '2026-11-20', day: 'Fri', temp_min: 9, temp_max: 15, condition: 'Rain', description: 'light rain', icon: '10d', humidity: 81, wind_speed: 5.2 },
      { date: '2026-11-21', day: 'Sat', temp_min: 8, temp_max: 13, condition: 'Clouds', description: 'broken clouds', icon: '04d', humidity: 76, wind_speed: 4.1 },
      { date: '2026-11-22', day: 'Sun', temp_min: 7, temp_max: 12, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 64, wind_speed: 3.4 },
      { date: '2026-11-23', day: 'Mon', temp_min: 6, temp_max: 11, condition: 'Rain', description: 'moderate rain', icon: '10d', humidity: 84, wind_speed: 6.0 },
      { date: '2026-11-24', day: 'Tue', temp_min: 8, temp_max: 14, condition: 'Clouds', description: 'scattered clouds', icon: '03d', humidity: 70, wind_speed: 4.4 },
    ],
  },
  islamabad: {
    city: 'Islamabad',
    country: 'PK',
    current: {
      temp: 21.5,
      feels_like: 21.0,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
      humidity: 48,
      pressure: 1018,
      wind_speed: 2.8,
      sunrise: 1763592000,
      sunset: 1763630400,
      dt: 1763620800,
    },
    forecast: [
      { date: '2026-11-20', day: 'Fri', temp_min: 12, temp_max: 23, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 45, wind_speed: 2.5 },
      { date: '2026-11-21', day: 'Sat', temp_min: 11, temp_max: 22, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 47, wind_speed: 2.9 },
      { date: '2026-11-22', day: 'Sun', temp_min: 10, temp_max: 21, condition: 'Clouds', description: 'few clouds', icon: '02d', humidity: 52, wind_speed: 3.1 },
      { date: '2026-11-23', day: 'Mon', temp_min: 9, temp_max: 20, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 49, wind_speed: 2.6 },
      { date: '2026-11-24', day: 'Tue', temp_min: 10, temp_max: 22, condition: 'Clouds', description: 'scattered clouds', icon: '03d', humidity: 55, wind_speed: 3.3 },
    ],
  },
  'new york': {
    city: 'New York',
    country: 'US',
    current: {
      temp: 9.8,
      feels_like: 7.2,
      condition: 'Rain',
      description: 'light rain',
      icon: '10d',
      humidity: 78,
      pressure: 1009,
      wind_speed: 6.8,
      sunrise: 1763608800,
      sunset: 1763643600,
      dt: 1763620800,
    },
    forecast: [
      { date: '2026-11-20', day: 'Fri', temp_min: 5, temp_max: 11, condition: 'Rain', description: 'light rain', icon: '10d', humidity: 82, wind_speed: 7.1 },
      { date: '2026-11-21', day: 'Sat', temp_min: 4, temp_max: 10, condition: 'Clouds', description: 'overcast clouds', icon: '04d', humidity: 74, wind_speed: 5.5 },
      { date: '2026-11-22', day: 'Sun', temp_min: 3, temp_max: 9, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 58, wind_speed: 4.2 },
      { date: '2026-11-23', day: 'Mon', temp_min: 6, temp_max: 13, condition: 'Clouds', description: 'broken clouds', icon: '04d', humidity: 66, wind_speed: 5.0 },
      { date: '2026-11-24', day: 'Tue', temp_min: 7, temp_max: 14, condition: 'Rain', description: 'moderate rain', icon: '10d', humidity: 80, wind_speed: 6.3 },
    ],
  },
  tokyo: {
    city: 'Tokyo',
    country: 'JP',
    current: {
      temp: 16.4,
      feels_like: 15.9,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
      humidity: 55,
      pressure: 1021,
      wind_speed: 3.9,
      sunrise: 1763588400,
      sunset: 1763625600,
      dt: 1763620800,
    },
    forecast: [
      { date: '2026-11-20', day: 'Fri', temp_min: 10, temp_max: 18, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 52, wind_speed: 3.2 },
      { date: '2026-11-21', day: 'Sat', temp_min: 11, temp_max: 19, condition: 'Clouds', description: 'few clouds', icon: '02d', humidity: 57, wind_speed: 3.6 },
      { date: '2026-11-22', day: 'Sun', temp_min: 9, temp_max: 17, condition: 'Rain', description: 'light rain', icon: '10d', humidity: 78, wind_speed: 4.8 },
      { date: '2026-11-23', day: 'Mon', temp_min: 8, temp_max: 16, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 54, wind_speed: 3.0 },
      { date: '2026-11-24', day: 'Tue', temp_min: 10, temp_max: 18, condition: 'Clouds', description: 'scattered clouds', icon: '03d', humidity: 60, wind_speed: 3.8 },
    ],
  },
  dubai: {
    city: 'Dubai',
    country: 'AE',
    current: {
      temp: 29.6,
      feels_like: 31.2,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
      humidity: 41,
      pressure: 1012,
      wind_speed: 4.2,
      sunrise: 1763600400,
      sunset: 1763638800,
      dt: 1763620800,
    },
    forecast: [
      { date: '2026-11-20', day: 'Fri', temp_min: 24, temp_max: 31, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 44, wind_speed: 4.0 },
      { date: '2026-11-21', day: 'Sat', temp_min: 24, temp_max: 32, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 40, wind_speed: 4.5 },
      { date: '2026-11-22', day: 'Sun', temp_min: 25, temp_max: 33, condition: 'Clouds', description: 'few clouds', icon: '02d', humidity: 43, wind_speed: 4.1 },
      { date: '2026-11-23', day: 'Mon', temp_min: 23, temp_max: 30, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 46, wind_speed: 3.8 },
      { date: '2026-11-24', day: 'Tue', temp_min: 24, temp_max: 31, condition: 'Clouds', description: 'scattered clouds', icon: '03d', humidity: 48, wind_speed: 4.3 },
    ],
  },
};

module.exports = { seedCities };
