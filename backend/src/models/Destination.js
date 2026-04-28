// src/models/Destination.js
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    latitude: Number,
    longitude: Number,
    description: String,
    bestTimeToVisit: String,
    attractions: [
      {
        name: String,
        type: String,
        description: String,
      },
    ],
    popularity: {
      type: Number,
      default: 0, // Based on search count
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
