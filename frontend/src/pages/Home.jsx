// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiMapPin, FiCalendar, FiShare2 } from 'react-icons/fi';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover destinations, create itineraries, and manage your travel plans in one place
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <FiArrowRight />
            </Link>
            <Link
              to="/explore"
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg border-2 border-blue-600 transition"
            >
              Explore Destinations
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Search Destinations</h3>
            <p className="text-gray-600">
              Search any city and get real-time weather, attractions, and travel info
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">Plan Itineraries</h3>
            <p className="text-gray-600">
              Create detailed day-by-day plans with activities, meals, and accommodations
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-2xl font-bold mb-2">Save & Manage</h3>
            <p className="text-gray-600">
              Save your trips to your account and update them anytime
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg mb-6 opacity-90">
            Start planning your next adventure today
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition inline-block"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
