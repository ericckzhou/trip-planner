// src/config/apiClients.js
const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 1 hour standard TTL (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * Get weather data from OpenWeather API
 * Caches results to minimize API calls
 */
const getWeatherData = async (lat, lon) => {
  const cacheKey = `weather_${lat}_${lon}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }
    );

    const weatherData = {
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };

    cache.set(cacheKey, weatherData);
    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error.message);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Get places/attractions from Google Places API
 * Returns nearby attractions for a given location
 */
const getAttractions = async (lat, lon, keyword = 'attractions') => {
  const cacheKey = `attractions_${lat}_${lon}_${keyword}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lon}`,
          radius: 5000,
          keyword,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    const attractions = response.data.results.slice(0, 10).map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      photo: place.photos ? place.photos[0].photo_reference : null,
    }));

    cache.set(cacheKey, attractions);
    return attractions;
  } catch (error) {
    console.error('Places API error:', error.message);
    throw new Error('Failed to fetch attractions');
  }
};

/**
 * Geocode a city name to coordinates
 * Uses Google Places API
 */
const geocodeCity = async (cityName) => {
  const cacheKey = `geocode_${cityName}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: cityName,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (!response.data.results[0]) {
      throw new Error('Location not found');
    }

    const location = response.data.results[0];
    const geocodeData = {
      city: cityName,
      lat: location.geometry.location.lat,
      lng: location.geometry.location.lng,
      formattedAddress: location.formatted_address,
    };

    cache.set(cacheKey, geocodeData);
    return geocodeData;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to geocode location');
  }
};

module.exports = {
  getWeatherData,
  getAttractions,
  geocodeCity,
  cache,
};
