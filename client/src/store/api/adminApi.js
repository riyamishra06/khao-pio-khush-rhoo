import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 20, search, role } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        
        return `/admin/users?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Admin', id },
        'Admin',
      ],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),

    // Get system statistics
    getSystemStats: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const queryString = params.toString();
        return `/admin/stats/system${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Analytics'],
    }),

    // Get user analytics
    getUserAnalytics: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const queryString = params.toString();
        return `/admin/analytics/users${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Analytics'],
    }),

    // Get nutrition analytics
    getNutritionAnalytics: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const queryString = params.toString();
        return `/admin/analytics/nutrition${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Analytics'],
    }),

    // Get food analytics
    getFoodAnalytics: builder.query({
      query: () => '/admin/analytics/foods',
      providesTags: ['Analytics'],
    }),

    // Export user data
    exportUserData: builder.query({
      query: (format = 'json') => `/admin/export/users?format=${format}`,
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSystemStatsQuery,
  useGetUserAnalyticsQuery,
  useGetNutritionAnalyticsQuery,
  useGetFoodAnalyticsQuery,
  useExportUserDataQuery,
} = adminApi;
