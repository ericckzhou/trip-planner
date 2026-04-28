// src/controllers/destinationController.js
const { asyncHandler } = require('../middleware/errorHandler');
const destinationService = require('../services/destinationService');

/**
 * @GET /api/destinations/search
 * Search destination by city name
 */
exports.searchDestination = asyncHandler(async (req, res) => {
  const { city } = req.query;

  const result = await destinationService.searchDestination(city);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @GET /api/destinations/trending
 * Get trending destinations
 */
exports.getTrendingDestinations = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const destinations = await destinationService.getTrendingDestinations(parseInt(limit));

  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations,
  });
});

/**
 * @GET /api/destinations/:id
 * Get destination details
 */
exports.getDestinationDetails = asyncHandler(async (req, res) => {
  const result = await destinationService.getDestinationDetails(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});
