// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/TripCard';
import toast from 'react-hot-toast';
import { FiPlus, FiFilter } from 'react-icons/fi';

export const Dashboard = () => {
  const { trips, loading, fetchTrips, deleteTrip } = useTrip();
  const { user } = useAuth();
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    fetchTrips(filter);
  }, [filter, fetchTrips]);

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const result = await deleteTrip(tripId);
      if (result.success) {
        toast.success('Trip deleted successfully');
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Manage and plan your amazing trips</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <Link
            to="/trip/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <FiPlus />
            <span>Create New Trip</span>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Trips
            </button>
            <button
              onClick={() => setFilter('planning')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'planning'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Planning
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Ongoing
            </button>
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No trips found</p>
            <Link
              to="/trip/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
