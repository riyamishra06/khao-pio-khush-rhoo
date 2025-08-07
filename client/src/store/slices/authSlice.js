import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Error parsing stored auth data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';

export default authSlice.reducer;
