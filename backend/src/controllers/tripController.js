// src/controllers/tripController.js
const { asyncHandler } = require('../middleware/errorHandler');
const tripService = require('../services/tripService');

/**
 * @POST /api/trips
 * Create a new trip (requires auth)
 */
exports.createTrip = asyncHandler(async (req, res) => {
  const tripData = {
    title: req.body.title,
    destination: req.body.destination,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    destinationLat: req.body.destinationLat,
    destinationLng: req.body.destinationLng,
  };

  const trip = await tripService.createTrip(req.user._id, tripData);

  res.status(201).json({
    success: true,
    message: 'Trip created successfully',
    data: trip,
  });
});

/**
 * @GET /api/trips
 * Get all trips for current user (requires auth)
 */
exports.getTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const trips = await tripService.getTripsByUser(req.user._id, status);

  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips,
  });
});

/**
 * @GET /api/trips/:id
 * Get specific trip by ID (requires auth)
 */
exports.getTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    data: trip,
  });
});

/**
 * @PUT /api/trips/:id
 * Update trip (requires auth)
 */
exports.updateTrip = asyncHandler(async (req, res) => {
  const allowedFields = ['title', 'description', 'startDate', 'endDate', 'budget', 'status', 'isPublic', 'tags'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const trip = await tripService.updateTrip(req.params.id, req.user._id, updates);

  res.status(200).json({
    success: true,
    message: 'Trip updated successfully',
    data: trip,
  });
});

/**
 * @DELETE /api/trips/:id
 * Delete trip (requires auth)
 */
exports.deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Trip deleted successfully',
  });
});

/**
 * @POST /api/trips/:id/itinerary
 * Add itinerary item to trip (requires auth)
 */
exports.addItineraryItem = asyncHandler(async (req, res) => {
  const itemData = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    category: req.body.category || 'activity',
    notes: req.body.notes,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    estimatedCost: req.body.estimatedCost,
  };

  const trip = await tripService.addItineraryItem(req.params.id, req.user._id, itemData);

  res.status(201).json({
    success: true,
    message: 'Itinerary item added successfully',
    data: trip,
  });
});

/**
 * @PUT /api/trips/:id/itinerary/:itemId
 * Update itinerary item (requires auth)
 */
exports.updateItineraryItem = asyncHandler(async (req, res) => {
  const itemData = req.body;

  const trip = await tripService.updateItineraryItem(
    req.params.id,
    req.user._id,
    req.params.itemId,
    itemData
  );

  res.status(200).json({
    success: true,
    message: 'Itinerary item updated successfully',
    data: trip,
  });
});

/**
 * @DELETE /api/trips/:id/itinerary/:itemId
 * Delete itinerary item (requires auth)
 */
exports.deleteItineraryItem = asyncHandler(async (req, res) => {
  const trip = await tripService.deleteItineraryItem(
    req.params.id,
    req.user._id,
    req.params.itemId
  );

  res.status(200).json({
    success: true,
    message: 'Itinerary item deleted successfully',
    data: trip,
  });
});

/**
 * @POST /api/trips/:id/save
 * Save trip to user's list (requires auth)
 */
exports.saveTrip = asyncHandler(async (req, res) => {
  const user = await tripService.saveTrip(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Trip saved successfully',
    data: user.savedTrips,
  });
});

/**
 * @POST /api/trips/:id/unsave
 * Unsave trip from user's list (requires auth)
 */
exports.unsaveTrip = asyncHandler(async (req, res) => {
  const user = await tripService.unsaveTrip(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Trip removed from saved trips',
    data: user.savedTrips,
  });
});
