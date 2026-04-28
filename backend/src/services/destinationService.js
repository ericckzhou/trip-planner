// src/services/destinationService.js
const Destination = require('../models/Destination');
const { getWeatherData, getAttractions, geocodeCity } = require('../config/apiClients');

/**
 * Service layer for destination/search operations
 * Integrates with external APIs
 */

const searchDestination = async (cityName) => {
  try {
    // Get location coordinates
    const locationData = await geocodeCity(cityName);

    // Get weather data
    const weatherData = await getWeatherData(locationData.lat, locationData.lng);

    // Get attractions
    const attractions = await getAttractions(locationData.lat, locationData.lng, 'tourist attraction');

    // Update popularity in database
    let destination = await Destination.findOne({ name: cityName });
    if (destination) {
      destination.popularity += 1;
      await destination.save();
    } else {
      // Create new destination entry
      destination = new Destination({
        name: cityName,
        country: locationData.formattedAddress.split(',').pop().trim(),
        latitude: locationData.lat,
        longitude: locationData.lng,
        popularity: 1,
      });
      await destination.save();
    }

    return {
      destination: {
        name: cityName,
        lat: locationData.lat,
        lng: locationData.lng,
        formattedAddress: locationData.formattedAddress,
      },
      weather: weatherData,
      attractions,
    };
  } catch (error) {
    throw new Error(`Failed to search destination: ${error.message}`);
  }
};

const getTrendingDestinations = async (limit = 10) => {
  try {
    const destinations = await Destination.find()
      .sort({ popularity: -1 })
      .limit(limit);

    return destinations;
  } catch (error) {
    throw new Error(`Failed to fetch trending destinations: ${error.message}`);
  }
};

const getDestinationDetails = async (destinationId) => {
  try {
    const destination = await Destination.findById(destinationId);

    if (!destination) {
      throw new Error('Destination not found');
    }

    // Get weather and attractions
    const weatherData = await getWeatherData(destination.latitude, destination.longitude);
    const attractions = await getAttractions(destination.latitude, destination.longitude);

    return {
      destination,
      weather: weatherData,
      attractions,
    };
  } catch (error) {
    throw new Error(`Failed to fetch destination details: ${error.message}`);
  }
};

module.exports = {
  searchDestination,
  getTrendingDestinations,
  getDestinationDetails,
};
