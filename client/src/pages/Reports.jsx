import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, BarChart3, Filter, RefreshCw } from 'lucide-react';
import { useGetNutritionReportsQuery, useGetChartDataQuery } from '../store/api/nutritionApi';
import { formatDateForAPI } from '../utils/api';
import NutritionChart, { CaloriesChart, MacroChart, TrendChart } from '../components/charts/NutritionChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [chartType, setChartType] = useState('daily');
  const [selectedView, setSelectedView] = useState('overview');

  // API queries
  const {
    data: reportsData,
    isLoading: isReportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useGetNutritionReportsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useGetChartDataQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    chartType,
  });

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    refetchReports();
    refetchChart();
  };

  const handleExportData = () => {
    if (reportsData) {
      const dataStr = JSON.stringify(reportsData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `nutrition-report-${dateRange.startDate}-to-${dateRange.endDate}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isLoading = isReportsLoading || isChartLoading;
  const hasError = reportsError || chartError;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Reports</h1>
              <p className="text-gray-600">Analyze your nutrition patterns and track your progress over time</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportData}
                disabled={!reportsData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range */}
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

            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* View Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="trends">Trends</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <LoadingSpinner text="Loading nutrition reports..." />
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Failed to load reports. Please try again.</p>
          </div>
        )}

        {/* Summary Statistics */}
        {reportsData && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily Calories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(reportsData.averages?.avgCalories || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily Protein</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(reportsData.averages?.avgProtein || 0)}g
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily Carbs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(reportsData.averages?.avgCarbs || 0)}g
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily Fat</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(reportsData.averages?.avgFat || 0)}g
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {chartData && !isLoading && (
          <div className="space-y-6">
            {selectedView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CaloriesChart
                  data={chartData}
                  title={`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Nutrition Trends`}
                />
                <MacroChart
                  data={chartData}
                  title="Macronutrient Distribution"
                />
              </div>
            )}

            {selectedView === 'detailed' && (
              <div className="space-y-6">
                <NutritionChart
                  data={chartData}
                  type="bar"
                  title={`Detailed ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Nutrition`}
                  height={500}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <NutritionChart
                    data={chartData}
                    type="bar"
                    title="Protein Intake"
                    height={300}
                  />
                  <NutritionChart
                    data={chartData}
                    type="bar"
                    title="Carbohydrate Intake"
                    height={300}
                  />
                  <NutritionChart
                    data={chartData}
                    type="bar"
                    title="Fat Intake"
                    height={300}
                  />
                </div>
              </div>
            )}

            {selectedView === 'trends' && (
              <div className="space-y-6">
                <TrendChart
                  data={chartData}
                  title={`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Nutrition Trends`}
                  height={500}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MacroChart
                    data={chartData}
                    title="Overall Macronutrient Distribution"
                  />
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date Range:</span>
                        <span className="font-medium">
                          {formatDateForDisplay(dateRange.startDate)} - {formatDateForDisplay(dateRange.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Days:</span>
                        <span className="font-medium">{reportsData?.dateRange?.dayCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Entries:</span>
                        <span className="font-medium">{reportsData?.totals?.entryCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Calories:</span>
                        <span className="font-medium">{Math.round(reportsData?.totals?.totalCalories || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Details */}
        {reportsData && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(reportsData.totals?.totalCalories || 0)}
                </p>
                <p className="text-sm text-gray-600">Total Calories</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(reportsData.totals?.totalProtein || 0)}g
                </p>
                <p className="text-sm text-gray-600">Total Protein</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.round(reportsData.totals?.totalCarbs || 0)}g
                </p>
                <p className="text-sm text-gray-600">Total Carbs</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(reportsData.totals?.totalFat || 0)}g
                </p>
                <p className="text-sm text-gray-600">Total Fat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;