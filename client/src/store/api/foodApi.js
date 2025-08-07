import { baseApi } from './baseApi';

export const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Search foods (public)
    searchFoods: builder.query({
      query: (searchQuery) => `/foods/search?q=${encodeURIComponent(searchQuery)}`,
      providesTags: ['Food'],
    }),

    // Get popular foods (public)
    getPopularFoods: builder.query({
      query: (limit = 20) => `/foods/popular?limit=${limit}`,
      providesTags: ['Food'],
    }),

    // Get food categories (public)
    getFoodCategories: builder.query({
      query: () => '/foods/categories',
      providesTags: ['Food'],
    }),

    // Get food by ID (public)
    getFoodById: builder.query({
      query: (id) => `/foods/${id}`,
      providesTags: (result, error, id) => [{ type: 'Food', id }],
    }),

    // Get all foods (authenticated)
    getAllFoods: builder.query({
      query: ({ page = 1, limit = 20, search, category, isVerified, isPublic } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (isVerified !== undefined) params.append('isVerified', isVerified.toString());
        if (isPublic !== undefined) params.append('isPublic', isPublic.toString());
        
        return `/foods?${params.toString()}`;
      },
      providesTags: ['Food'],
    }),

    // Create food (admin only)
    createFood: builder.mutation({
      query: (foodData) => ({
        url: '/foods',
        method: 'POST',
        body: foodData,
      }),
      invalidatesTags: ['Food'],
    }),

    // Update food (admin only)
    updateFood: builder.mutation({
      query: ({ id, ...foodData }) => ({
        url: `/foods/${id}`,
        method: 'PUT',
        body: foodData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Food', id },
        'Food',
      ],
    }),

    // Delete food (admin only)
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/foods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Food'],
    }),

    // Verify food (admin only)
    verifyFood: builder.mutation({
      query: ({ id, isVerified, verificationNotes }) => ({
        url: `/foods/${id}/verify`,
        method: 'PATCH',
        body: { isVerified, verificationNotes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Food', id },
        'Food',
      ],
    }),
  }),
});

export const {
  useSearchFoodsQuery,
  useGetPopularFoodsQuery,
  useGetFoodCategoriesQuery,
  useGetFoodByIdQuery,
  useGetAllFoodsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useVerifyFoodMutation,
} = foodApi;
