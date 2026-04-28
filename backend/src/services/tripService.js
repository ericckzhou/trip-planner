// src/services/tripService.js
const Trip = require('../models/Trip');
const User = require('../models/User');

/**
 * Service layer for trip operations
 * Handles CRUD and business logic for trips and itineraries
 */

const createTrip = async (userId, tripData) => {
  const trip = new Trip({
    userId,
    ...tripData,
  });

  await trip.save();
  await trip.populate('userId', 'email firstName lastName');

  return trip;
};

const getTripsByUser = async (userId, status = null) => {
  const query = { userId };
  if (status) {
    query.status = status;
  }

  const trips = await Trip.find(query)
    .populate('userId', 'email firstName lastName')
    .sort({ createdAt: -1 });

  return trips;
};

const getTripById = async (tripId, userId = null) => {
  const trip = await Trip.findById(tripId).populate('userId', 'email firstName lastName');

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization (unless userId is null - for admin/public queries)
  if (userId && trip.userId._id.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this trip');
  }

  return trip;
};

const updateTrip = async (tripId, userId, updates) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization
  if (trip.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this trip');
  }

  // Don't allow userId changes
  delete updates.userId;

  Object.assign(trip, updates);
  await trip.save();
  await trip.populate('userId', 'email firstName lastName');

  return trip;
};

const deleteTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization
  if (trip.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this trip');
  }

  // Remove trip from user's savedTrips
  await User.findByIdAndUpdate(userId, {
    $pull: { savedTrips: tripId },
  });

  await Trip.findByIdAndDelete(tripId);

  return { message: 'Trip deleted successfully' };
};

const addItineraryItem = async (tripId, userId, itemData) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization
  if (trip.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to add items to this trip');
  }

  trip.itinerary.push(itemData);
  await trip.save();

  return trip;
};

const updateItineraryItem = async (tripId, userId, itemId, itemData) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization
  if (trip.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to update items in this trip');
  }

  const item = trip.itinerary.id(itemId);
  if (!item) {
    throw new Error('Itinerary item not found');
  }

  Object.assign(item, itemData);
  await trip.save();

  return trip;
};

const deleteItineraryItem = async (tripId, userId, itemId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check authorization
  if (trip.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete items from this trip');
  }

  trip.itinerary.id(itemId).deleteOne();
  await trip.save();

  return trip;
};

const saveTrip = async (userId, tripId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.savedTrips.includes(tripId)) {
    user.savedTrips.push(tripId);
    await user.save();
  }

  return user;
};

const unsaveTrip = async (userId, tripId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.savedTrips = user.savedTrips.filter((id) => id.toString() !== tripId.toString());
  await user.save();

  return user;
};

module.exports = {
  createTrip,
  getTripsByUser,
  getTripById,
  updateTrip,
  deleteTrip,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  saveTrip,
  unsaveTrip,
};
