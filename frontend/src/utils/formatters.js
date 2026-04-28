// src/utils/formatters.js
import { format, differenceInDays } from 'date-fns';

/**
 * Format a date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

/**
 * Format a date to readable format
 */
export const formatDateReadable = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Calculate trip duration in days
 */
export const calculateTripDuration = (startDate, endDate) => {
  return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
