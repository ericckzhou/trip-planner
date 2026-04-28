// src/models/Trip.js
const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
      required: [true, 'Please provide an activity title'],
    },
    description: String,
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
    time: String, // Format: "HH:MM"
    location: {
      type: String,
      required: true,
    },
    latitude: Number,
    longitude: Number,
    category: {
      type: String,
      enum: ['accommodation', 'activity', 'meal', 'transport', 'other'],
      default: 'activity',
    },
    notes: String,
    estimatedCost: Number,
  },
  { timestamps: true }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
    },
    destinationLat: Number,
    destinationLng: Number,
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    description: String,
    itinerary: [itineraryItemSchema],
    budget: {
      currency: {
        type: String,
        default: 'USD',
      },
      estimatedTotal: Number,
      actualSpent: Number,
    },
    participants: [
      {
        name: String,
        email: String,
      },
    ],
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed'],
      default: 'planning',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Validate end date is after start date
tripSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Middleware to populate userId
tripSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'userId',
    select: 'email firstName lastName',
  });
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
