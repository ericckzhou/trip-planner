// src/components/TripCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCalendar, FiMapPin } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export const TripCard = ({ trip, onDelete }) => {
  const daysRemaining = Math.ceil(
    (new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Header with destination */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <h3 className="text-2xl font-bold mb-1">{trip.title}</h3>
        <div className="flex items-center space-x-1 text-sm">
          <FiMapPin size={16} />
          <span>{trip.destination}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Dates */}
        <div className="flex items-center space-x-1 text-gray-700 mb-2">
          <FiCalendar size={16} />
          <span className="text-sm">
            {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
          </span>
        </div>

        {/* Status badge */}
        <div className="mb-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              trip.status === 'planning'
                ? 'bg-blue-100 text-blue-800'
                : trip.status === 'ongoing'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {trip.status.toUpperCase()}
          </span>
        </div>

        {/* Itinerary count */}
        <p className="text-sm text-gray-600 mb-4">
          {trip.itinerary?.length || 0} activities planned
        </p>

        {/* Description */}
        {trip.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {trip.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex space-x-2">
        <Link
          to={`/trip/${trip._id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition text-center text-sm font-medium flex items-center justify-center space-x-1"
        >
          <FiEdit2 size={16} />
          <span>View</span>
        </Link>
        <button
          onClick={() => onDelete(trip._id)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};
