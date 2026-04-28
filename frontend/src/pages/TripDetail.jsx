// src/pages/TripDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useForm } from '../hooks/useForm';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDateReadable } from '../utils/formatters';

export const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, loading, fetchTrip, updateTrip, addItineraryItem, deleteItineraryItem } = useTrip();
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    fetchTrip(id);
  }, [id, fetchTrip]);

  const { values, handleChange, handleSubmit, reset } = useForm(
    {
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'activity',
      notes: '',
    },
    async (formValues) => {
      const result = await addItineraryItem(id, formValues);
      if (result.success) {
        toast.success('Activity added!');
        reset();
        setShowAddItem(false);
      } else {
        toast.error(result.error);
      }
    }
  );

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Delete this activity?')) {
      const result = await deleteItineraryItem(id, itemId);
      if (result.success) {
        toast.success('Activity deleted');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Trip not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <FiArrowLeft />
          <span>Back to Dashboard</span>
        </button>

        {/* Trip Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">{currentTrip.title}</h1>
          <p className="text-lg opacity-90">{currentTrip.destination}</p>
          <p className="text-sm mt-2 opacity-75">
            {formatDateReadable(currentTrip.startDate)} to {formatDateReadable(currentTrip.endDate)}
          </p>
        </div>

        {/* Trip Description */}
        {currentTrip.description && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">About This Trip</h2>
            <p className="text-gray-700">{currentTrip.description}</p>
          </div>
        )}

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Itinerary ({currentTrip.itinerary?.length || 0})</h2>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Add Activity Form */}
          {showAddItem && (
            <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="Activity title"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  placeholder="Time"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activity">Activity</option>
                  <option value="meal">Meal</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="transport">Transport</option>
                </select>
              </div>

              <input
                type="text"
                name="location"
                value={values.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />

              <textarea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              ></textarea>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Activities List */}
          {currentTrip.itinerary && currentTrip.itinerary.length > 0 ? (
            <div className="space-y-4">
              {[...currentTrip.itinerary]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((item) => (
                  <div
                    key={item._id}
                    className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDateReadable(item.date)}
                          {item.time && ` at ${item.time}`}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">📍 {item.location}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-500 hover:text-red-700 transition ml-4"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No activities yet. Add one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
