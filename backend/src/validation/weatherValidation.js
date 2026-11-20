// Strict validation for the `city` query parameter (Zero Trust: never
// trust client input). Only real city names are accepted:
//  - trimmed, 1–100 characters
//  - letters (including accented), spaces, hyphens, apostrophes, dots
// Anything else — <script>, SQL fragments, URLs, control characters —
// is rejected with a 400 before it ever reaches a service or an API.
const { z } = require('zod');

const citySchema = z
  .string({ required_error: 'City is required.' })
  .trim()
  .min(1, 'City must not be empty.')
  .max(100, 'City name is too long (max 100 characters).')
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-.\s]+$/,
    'City name contains invalid characters. Use letters, spaces, hyphens and apostrophes only.'
  );

const cityQuerySchema = z.object({
  city: citySchema,
});

/**
 * Validate and normalise the city query param.
 * @returns {{ city: string }} the validated, trimmed city name
 * @throws {Error} with a Zod issue list (handled by the controller)
 */
function validateCityQuery(query) {
  return cityQuerySchema.parse(query);
}

/** Normalised cache key — always derived from validated input only. */
function normaliseCity(city) {
  return city.trim().toLowerCase();
}

module.exports = { citySchema, cityQuerySchema, validateCityQuery, normaliseCity };
