// src/routes/tripRoutes.js
const express = require('express');
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { validateTripCreation, validateItineraryItem } = require('../middleware/validation');

const router = express.Router();

/**
 * Trip CRUD routes (protected)
 * POST /api/trips - Create trip
 * GET /api/trips - Get all user trips
 * GET /api/trips/:id - Get specific trip
 * PUT /api/trips/:id - Update trip
 * DELETE /api/trips/:id - Delete trip
 * 
 * Itinerary routes (protected)
 * POST /api/trips/:id/itinerary - Add itinerary item
 * PUT /api/trips/:id/itinerary/:itemId - Update item
 * DELETE /api/trips/:id/itinerary/:itemId - Delete item
 * 
 * Save/Unsave routes (protected)
 * POST /api/trips/:id/save - Save trip
 * POST /api/trips/:id/unsave - Unsave trip
 */

// All trip routes are protected
router.use(protect);

// Trip CRUD
router.post('/', validateTripCreation, tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// Itinerary
router.post('/:id/itinerary', validateItineraryItem, tripController.addItineraryItem);
router.put('/:id/itinerary/:itemId', tripController.updateItineraryItem);
router.delete('/:id/itinerary/:itemId', tripController.deleteItineraryItem);

// Save/Unsave
router.post('/:id/save', tripController.saveTrip);
router.post('/:id/unsave', tripController.unsaveTrip);

module.exports = router;
