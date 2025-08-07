import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User login
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // User registration
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/register/user',
        method: 'POST',
        body: userData,
      }),
    }),

    // Admin registration
    registerAdmin: builder.mutation({
      query: (adminData) => ({
        url: '/auth/register/admin',
        method: 'POST',
        body: adminData,
      }),
    }),

    // Verify token
    verifyToken: builder.query({
      query: () => '/auth/verify',
      providesTags: ['User'],
    }),

    // Get user profile
    getUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    // Set nutrition goals
    setNutritionGoals: builder.mutation({
      query: (goalsData) => ({
        url: '/users/goals',
        method: 'POST',
        body: goalsData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRegisterAdminMutation,
  useVerifyTokenQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useSetNutritionGoalsMutation,
} = authApi;
