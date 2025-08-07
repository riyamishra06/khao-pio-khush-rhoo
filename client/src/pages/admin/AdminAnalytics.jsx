import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, Package, BarChart3, Download } from 'lucide-react';
import { 
  useGetUserAnalyticsQuery, 
  useGetNutritionAnalyticsQuery, 
  useGetFoodAnalyticsQuery,
  useGetSystemStatsQuery 
} from '../../store/api/adminApi';
import NutritionChart from '../../components/charts/NutritionChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const {
    data: systemStats,
    isLoading: isStatsLoading,
  } = useGetSystemStatsQuery(dateRange);

  const {
    data: userAnalytics,
    isLoading: isUserAnalyticsLoading,
  } = useGetUserAnalyticsQuery(dateRange);

  const {
    data: nutritionAnalytics,
    isLoading: isNutritionAnalyticsLoading,
  } = useGetNutritionAnalyticsQuery(dateRange);

  const {
    data: foodAnalytics,
    isLoading: isFoodAnalyticsLoading,
  } = useGetFoodAnalyticsQuery();

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatChartData = (data, type = 'user') => {
    if (!data || !Array.isArray(data)) return { data: [] };
    
    return {
      data: data.map(item => ({
        _id: item._id,
        calories: type === 'nutrition' ? item.totalCalories : 0,
        protein: type === 'nutrition' ? item.totalProtein : 0,
        carbs: type === 'nutrition' ? item.totalCarbs : 0,
        fat: type === 'nutrition' ? item.totalFat : 0,
        count: type === 'user' ? item.count : item.entryCount || 0,
      })),
      chartType: 'daily'
    };
  };

  const isLoading = isStatsLoading || isUserAnalyticsLoading || isNutritionAnalyticsLoading || isFoodAnalyticsLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive system analytics and insights</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* System Overview */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Foods</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalFoods}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nutrition Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalNutritionEntries}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsersToday}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            {isUserAnalyticsLoading ? (
              <LoadingSpinner text="Loading user analytics..." />
            ) : userAnalytics ? (
              <NutritionChart 
                data={formatChartData(userAnalytics, 'user')}
                type="line"
                title=""
                height={300}
              />
            ) : (
              <p className="text-gray-500">No user analytics data available</p>
            )}
          </div>

          {/* Nutrition Trends Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Trends</h3>
            {isNutritionAnalyticsLoading ? (
              <LoadingSpinner text="Loading nutrition analytics..." />
            ) : nutritionAnalytics ? (
              <NutritionChart 
                data={formatChartData(nutritionAnalytics, 'nutrition')}
                type="bar"
                title=""
                height={300}
              />
            ) : (
              <p className="text-gray-500">No nutrition analytics data available</p>
            )}
          </div>
        </div>

        {/* Food Analytics */}
        {foodAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Categories</h3>
              <div className="space-y-3">
                {foodAnalytics.categoryStats?.slice(0, 8).map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">
                      {category._id?.replace('_', ' ') || 'Unknown'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${(category.count / Math.max(...foodAnalytics.categoryStats.map(c => c.count))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {category.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Foods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Foods</h3>
              <div className="space-y-3">
                {foodAnalytics.popularFoods?.slice(0, 8).map((food, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-900 font-medium">{food.name}</span>
                      {food.brand && (
                        <span className="text-gray-500 text-sm ml-2">({food.brand})</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {food.usageCount} uses
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {foodAnalytics?.verificationStats && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Verification Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodAnalytics.verificationStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-600">
                    {stat._id ? 'Verified Foods' : 'Unverified Foods'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
