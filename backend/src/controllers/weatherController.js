// Weather controller — thin layer: validate input, delegate to the
// service, shape the HTTP response. No business logic lives here.
const { ZodError } = require('zod');
const weatherService = require('../services/weatherService');
const { validateCityQuery } = require('../validation/weatherValidation');
const ApiError = require('../utils/errors');

async function getWeather(req, res, next) {
  try {
    let city;
    try {
      ({ city } = validateCityQuery(req.query));
    } catch (error) {
      if (error instanceof ZodError) {
        const first = error.issues[0];
        throw ApiError.badRequest(first.message, 'INVALID_CITY');
      }
      throw error;
    }
    const data = await weatherService.getWeather(city);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getForecast(req, res, next) {
  try {
    let city;
    try {
      ({ city } = validateCityQuery(req.query));
    } catch (error) {
      if (error instanceof ZodError) {
        const first = error.issues[0];
        throw ApiError.badRequest(first.message, 'INVALID_CITY');
      }
      throw error;
    }
    const data = await weatherService.getWeather(city);
    return res.status(200).json({
      demo: data.demo,
      city: data.city,
      country: data.country,
      forecast: data.forecast,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getWeather, getForecast };
