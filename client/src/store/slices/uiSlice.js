import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Navigation
  sidebarOpen: false,
  
  // Modals
  modals: {
    addFood: false,
    editFood: false,
    addNutrition: false,
    editNutrition: false,
    userProfile: false,
    nutritionGoals: false,
  },
  
  // Loading states
  loading: {
    global: false,
    foods: false,
    nutrition: false,
    reports: false,
    admin: false,
  },
  
  // Filters and search
  filters: {
    foods: {
      search: '',
      category: '',
      isVerified: null,
      page: 1,
      limit: 20,
    },
    nutrition: {
      startDate: '',
      endDate: '',
      mealType: '',
      page: 1,
      limit: 20,
    },
    users: {
      search: '',
      role: '',
      page: 1,
      limit: 20,
    },
  },
  
  // Selected items
  selectedItems: {
    food: null,
    nutritionEntry: null,
    user: null,
  },
  
  // Notifications
  notifications: [],
  
  // Theme
  theme: 'light',
  
  // Date range for reports
  reportDateRange: {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Loading states
    setLoading: (state, action) => {
      const { type, isLoading } = action.payload;
      state.loading[type] = isLoading;
    },
    
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Filters
    setFilter: (state, action) => {
      const { type, key, value } = action.payload;
      state.filters[type][key] = value;
    },
    
    resetFilters: (state, action) => {
      const type = action.payload;
      state.filters[type] = initialState.filters[type];
    },
    
    // Selected items
    setSelectedItem: (state, action) => {
      const { type, item } = action.payload;
      state.selectedItems[type] = item;
    },
    
    clearSelectedItems: (state) => {
      state.selectedItems = initialState.selectedItems;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    // Report date range
    setReportDateRange: (state, action) => {
      state.reportDateRange = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  setFilter,
  resetFilters,
  setSelectedItem,
  clearSelectedItems,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setReportDateRange,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModals = (state) => state.ui.modals;
export const selectLoading = (state) => state.ui.loading;
export const selectFilters = (state) => state.ui.filters;
export const selectSelectedItems = (state) => state.ui.selectedItems;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;
export const selectReportDateRange = (state) => state.ui.reportDateRange;

export default uiSlice.reducer;
