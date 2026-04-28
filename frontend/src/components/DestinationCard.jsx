// src/components/DestinationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCloud, FiMapPin, FiStar } from 'react-icons/fi';

export const DestinationCard = ({ destination, weather, attractions }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Weather Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
        <p className="text-sm text-blue-100 mb-4">{destination.formattedAddress}</p>

        {weather && (
          <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm capitalize">{weather.description}</p>
                <p className="text-2xl font-bold">{weather.temp}°C</p>
              </div>
              <div className="text-4xl">
                <FiCloud />
              </div>
            </div>
            <p className="text-xs mt-2">Humidity: {weather.humidity}%</p>
          </div>
        )}
      </div>

      {/* Attractions */}
      <div className="p-6">
        <h4 className="font-bold text-lg mb-4 flex items-center space-x-2">
          <FiMapPin className="text-red-500" />
          <span>Top Attractions</span>
        </h4>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {attractions && attractions.slice(0, 5).map((attraction) => (
            <div
              key={attraction.id}
              className="border-l-4 border-blue-500 pl-3 py-2"
            >
              <p className="font-medium text-sm">{attraction.name}</p>
              <p className="text-xs text-gray-600">{attraction.address}</p>
              {attraction.rating && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiStar className="text-yellow-500" size={14} />
                  <span className="text-xs font-medium">{attraction.rating}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="p-6 pt-0">
        <Link
          to={`/trip/new?destination=${destination.name}&lat=${destination.lat}&lng=${destination.lng}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition block text-center"
        >
          Plan Trip Here
        </Link>
      </div>
    </div>
  );
};
