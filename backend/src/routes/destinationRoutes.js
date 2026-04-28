// src/routes/destinationRoutes.js
const express = require('express');
const destinationController = require('../controllers/destinationController');
const { validateDestinationSearch } = require('../middleware/validation');

const router = express.Router();

/**
 * Destination routes (public)
 * GET /api/destinations/search?city=Paris - Search destination
 * GET /api/destinations/trending - Get trending destinations
 * GET /api/destinations/:id - Get destination details
 */

router.get('/search', validateDestinationSearch, destinationController.searchDestination);
router.get('/trending', destinationController.getTrendingDestinations);
router.get('/:id', destinationController.getDestinationDetails);

module.exports = router;
