// src/pages/Explore.jsx
import React, { useState } from 'react';
import { destinationService } from '../services/api';
import { DestinationCard } from '../components/DestinationCard';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

export const Explore = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      const response = await destinationService.searchDestination(searchQuery);
      setSearchResults(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to search destination'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Destinations
          </h1>
          <p className="text-gray-600 mb-8">
            Search any city to discover its weather, attractions, and start planning
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a city name (e.g., Paris, Tokyo, Barcelona)"
                className="w-full px-6 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-r-lg transition disabled:opacity-50 flex items-center space-x-2"
              >
                <FiSearch />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {searchResults && !loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DestinationCard
              destination={searchResults.destination}
              weather={searchResults.weather}
              attractions={searchResults.attractions}
            />
          </div>
        )}

        {!searchResults && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              Search for a destination to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
