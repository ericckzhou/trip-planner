// src/pages/CreateTrip.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useForm } from '../hooks/useForm';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

export const CreateTrip = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createTrip } = useTrip();

  const destination = searchParams.get('destination') || '';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';

  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      title: '',
      destination: destination,
      startDate: '',
      endDate: '',
      description: '',
      destinationLat: lat,
      destinationLng: lng,
    },
    async (formValues) => {
      // Validate dates
      if (new Date(formValues.endDate) <= new Date(formValues.startDate)) {
        toast.error('End date must be after start date');
        return;
      }

      const result = await createTrip(formValues);
      if (result.success) {
        toast.success('Trip created successfully!');
        navigate(`/trip/${result.data._id}`);
      } else {
        toast.error(result.error);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Trip</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="e.g., Summer in Europe 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <FiMapPin />
                <span>Destination <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="destination"
                value={values.destination}
                onChange={handleChange}
                placeholder="e.g., Paris"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <FiCalendar />
                  <span>Start Date <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <FiCalendar />
                  <span>End Date <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Add any notes about your trip..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
