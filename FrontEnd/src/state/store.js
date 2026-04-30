// filepath: src/state/store.js
import { MOVIES, SHOWTIMES, DATES, TICKET_PRICES } from '../data/movies.js';

export const state = {
  selectedDate: '2026-03-03',
  seats: {}
};

// Re-export data accessors for convenience
export { MOVIES, SHOWTIMES, DATES, TICKET_PRICES };

// Helper functions for data lookup
export function findMovie(id) {
  return MOVIES.find(m => m.id === id);
}

export function findShowtime(id) {
  return SHOWTIMES.find(s => s.id === id);
}

export function byMovie(movieId) {
  return SHOWTIMES.filter(s => s.movieId === movieId);
}