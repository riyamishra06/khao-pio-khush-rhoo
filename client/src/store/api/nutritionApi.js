import { baseApi } from './baseApi';

export const nutritionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get nutrition entries
    getNutritionEntries: builder.query({
      query: ({ page = 1, limit = 20, startDate, endDate, mealType } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (mealType) params.append('mealType', mealType);
        
        return `/nutrition?${params.toString()}`;
      },
      providesTags: ['Nutrition'],
    }),

    // Create nutrition entry
    createNutritionEntry: builder.mutation({
      query: (entryData) => ({
        url: '/nutrition',
        method: 'POST',
        body: entryData,
      }),
      invalidatesTags: ['Nutrition', 'DailySummary'],
    }),

    // Get nutrition entry by ID
    getNutritionEntryById: builder.query({
      query: (id) => `/nutrition/${id}`,
      providesTags: (result, error, id) => [{ type: 'Nutrition', id }],
    }),

    // Update nutrition entry
    updateNutritionEntry: builder.mutation({
      query: ({ id, ...entryData }) => ({
        url: `/nutrition/${id}`,
        method: 'PUT',
        body: entryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Nutrition', id },
        'Nutrition',
        'DailySummary',
      ],
    }),

    // Delete nutrition entry
    deleteNutritionEntry: builder.mutation({
      query: (id) => ({
        url: `/nutrition/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Nutrition', 'DailySummary'],
    }),

    // Get daily summary
    getDailySummary: builder.query({
      query: (date) => {
        const params = date ? `?date=${date}` : '';
        return `/nutrition/summary/daily${params}`;
      },
      providesTags: ['DailySummary'],
    }),

    // Get nutrition reports
    getNutritionReports: builder.query({
      query: ({ startDate, endDate }) => 
        `/nutrition/reports?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Report'],
    }),

    // Get chart data
    getChartData: builder.query({
      query: ({ startDate, endDate, chartType = 'daily' }) => 
        `/nutrition/charts?startDate=${startDate}&endDate=${endDate}&chartType=${chartType}`,
      providesTags: ['Report'],
    }),

    // Get goals progress
    getGoalsProgress: builder.query({
      query: (date) => {
        const params = date ? `?date=${date}` : '';
        return `/nutrition/goals/progress${params}`;
      },
      providesTags: ['DailySummary'],
    }),
  }),
});

export const {
  useGetNutritionEntriesQuery,
  useCreateNutritionEntryMutation,
  useGetNutritionEntryByIdQuery,
  useUpdateNutritionEntryMutation,
  useDeleteNutritionEntryMutation,
  useGetDailySummaryQuery,
  useGetNutritionReportsQuery,
  useGetChartDataQuery,
  useGetGoalsProgressQuery,
} = nutritionApi;
