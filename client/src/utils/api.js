// API utility functions

// Base URL for the API
export const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER_USER: '/auth/register/user',
  REGISTER_ADMIN: '/auth/register/admin',
  VERIFY_TOKEN: '/auth/verify',
  
  // Users
  USER_PROFILE: '/users/profile',
  USER_GOALS: '/users/goals',
  
  // Foods
  FOODS: '/foods',
  FOODS_SEARCH: '/foods/search',
  FOODS_POPULAR: '/foods/popular',
  FOODS_CATEGORIES: '/foods/categories',
  
  // Nutrition
  NUTRITION: '/nutrition',
  NUTRITION_SUMMARY: '/nutrition/summary/daily',
  NUTRITION_REPORTS: '/nutrition/reports',
  NUTRITION_CHARTS: '/nutrition/charts',
  NUTRITION_GOALS_PROGRESS: '/nutrition/goals/progress',
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_STATS: '/admin/stats/system',
  ADMIN_ANALYTICS_USERS: '/admin/analytics/users',
  ADMIN_ANALYTICS_NUTRITION: '/admin/analytics/nutrition',
  ADMIN_ANALYTICS_FOODS: '/admin/analytics/foods',
  ADMIN_EXPORT_USERS: '/admin/export/users',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FOOD_CREATED: 'Food item created successfully!',
  FOOD_UPDATED: 'Food item updated successfully!',
  FOOD_DELETED: 'Food item deleted successfully!',
  NUTRITION_ENTRY_CREATED: 'Nutrition entry added successfully!',
  NUTRITION_ENTRY_UPDATED: 'Nutrition entry updated successfully!',
  NUTRITION_ENTRY_DELETED: 'Nutrition entry deleted successfully!',
  GOALS_UPDATED: 'Nutrition goals updated successfully!',
};

// Format error message from API response
export const formatErrorMessage = (error) => {
  if (error?.data?.error) {
    if (typeof error.data.error === 'string') {
      return error.data.error;
    }
    if (Array.isArray(error.data.error)) {
      return error.data.error.join(', ');
    }
    if (typeof error.data.error === 'object') {
      return Object.values(error.data.error).flat().join(', ');
    }
  }
  
  if (error?.status) {
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Format date for API
export const formatDateForAPI = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  return '';
};

// Parse date from API
export const parseDateFromAPI = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Build query string from object
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
