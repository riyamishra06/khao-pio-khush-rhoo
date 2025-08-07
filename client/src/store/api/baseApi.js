import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from state
    const token = getState().auth.token;
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, logout the user
  if (result.error && result.error.status === 401) {
    // Dispatch logout action
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 
    'Food', 
    'Nutrition', 
    'DailySummary', 
    'Report', 
    'Admin',
    'Analytics'
  ],
  endpoints: () => ({}),
});

export default baseApi;
