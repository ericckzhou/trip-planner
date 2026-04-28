// src/context/TripContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { tripService } from '../services/api';

const TripContext = createContext(null);

/**
 * TripProvider - Manages trip state and operations
 * Provides trip data and CRUD functions
 */
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all trips
  const fetchTrips = useCallback(async (status = null) => {
    try {
      setLoading(true);
      const response = await tripService.getTrips(status);
      setTrips(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trips',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single trip
  const fetchTrip = useCallback(async (tripId) => {
    try {
      setLoading(true);
      const response = await tripService.getTrip(tripId);
      setCurrentTrip(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trip',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create trip
  const createTrip = useCallback(async (tripData) => {
    try {
      setLoading(true);
      const response = await tripService.createTrip(tripData);
      const newTrip = response.data.data;
      setTrips([newTrip, ...trips]);
      return { success: true, data: newTrip };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create trip',
      };
    } finally {
      setLoading(false);
    }
  }, [trips]);

  // Update trip
  const updateTrip = useCallback(
    async (tripId, updates) => {
      try {
        setLoading(true);
        const response = await tripService.updateTrip(tripId, updates);
        const updatedTrip = response.data.data;

        setTrips(trips.map((t) => (t._id === tripId ? updatedTrip : t)));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(updatedTrip);
        }

        return { success: true, data: updatedTrip };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to update trip',
        };
      } finally {
        setLoading(false);
      }
    },
    [trips, currentTrip]
  );

  // Delete trip
  const deleteTrip = useCallback(
    async (tripId) => {
      try {
        setLoading(true);
        await tripService.deleteTrip(tripId);
        setTrips(trips.filter((t) => t._id !== tripId));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(null);
        }
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to delete trip',
        };
      } finally {
        setLoading(false);
      }
    },
    [trips, currentTrip]
  );

  // Add itinerary item
  const addItineraryItem = useCallback(
    async (tripId, itemData) => {
      try {
        setLoading(true);
        const response = await tripService.addItineraryItem(tripId, itemData);
        const updatedTrip = response.data.data;

        setTrips(trips.map((t) => (t._id === tripId ? updatedTrip : t)));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(updatedTrip);
        }

        return { success: true, data: updatedTrip };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to add itinerary item',
        };
      } finally {
        setLoading(false);
      }
    },
    [trips, currentTrip]
  );

  // Update itinerary item
  const updateItineraryItem = useCallback(
    async (tripId, itemId, itemData) => {
      try {
        setLoading(true);
        const response = await tripService.updateItineraryItem(
          tripId,
          itemId,
          itemData
        );
        const updatedTrip = response.data.data;

        setTrips(trips.map((t) => (t._id === tripId ? updatedTrip : t)));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(updatedTrip);
        }

        return { success: true, data: updatedTrip };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || 'Failed to update itinerary item',
        };
      } finally {
        setLoading(false);
      }
    },
    [trips, currentTrip]
  );

  // Delete itinerary item
  const deleteItineraryItem = useCallback(
    async (tripId, itemId) => {
      try {
        setLoading(true);
        const response = await tripService.deleteItineraryItem(tripId, itemId);
        const updatedTrip = response.data.data;

        setTrips(trips.map((t) => (t._id === tripId ? updatedTrip : t)));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(updatedTrip);
        }

        return { success: true, data: updatedTrip };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || 'Failed to delete itinerary item',
        };
      } finally {
        setLoading(false);
      }
    },
    [trips, currentTrip]
  );

  const value = {
    trips,
    currentTrip,
    loading,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    addItineraryItem,
    updateItineraryItem,
    deleteItineraryItem,
  };

  return (
    <TripContext.Provider value={value}>{children}</TripContext.Provider>
  );
};

// Custom hook to use trip context
export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};
