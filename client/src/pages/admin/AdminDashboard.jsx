import React from 'react';
import { Users, Package, TrendingUp, Activity, Eye, UserPlus, ShoppingCart } from 'lucide-react';
import { useGetSystemStatsQuery, useGetUserAnalyticsQuery, useGetFoodAnalyticsQuery } from '../../store/api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const {
    data: systemStats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useGetSystemStatsQuery();

  const {
    data: userAnalytics,
    isLoading: isUserAnalyticsLoading,
  } = useGetUserAnalyticsQuery();

  const {
    data: foodAnalytics,
    isLoading: isFoodAnalyticsLoading,
  } = useGetFoodAnalyticsQuery();

  if (isStatsLoading) {
    return <LoadingSpinner fullScreen text="Loading admin dashboard..." />;
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor system performance and manage your nutrition tracking platform</p>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={systemStats?.totalUsers || 0}
            icon={Users}
            color="bg-blue-500"
            change={systemStats?.newUsersThisMonth}
            changeType="positive"
          />
          <StatCard
            title="Total Foods"
            value={systemStats?.totalFoods || 0}
            icon={Package}
            color="bg-green-500"
          />
          <StatCard
            title="Nutrition Entries"
            value={systemStats?.totalNutritionEntries || 0}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Users Today"
            value={systemStats?.activeUsersToday || 0}
            icon={Activity}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Manage Users"
              description="View and manage user accounts"
              icon={Users}
              color="bg-blue-500"
              onClick={() => window.location.href = '/admin/users'}
            />
            <QuickActionCard
              title="Manage Foods"
              description="Add, edit, and verify food items"
              icon={Package}
              color="bg-green-500"
              onClick={() => window.location.href = '/admin/foods'}
            />
            <QuickActionCard
              title="View Analytics"
              description="Detailed system analytics and reports"
              icon={TrendingUp}
              color="bg-purple-500"
              onClick={() => window.location.href = '/admin/analytics'}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Analytics Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            {isUserAnalyticsLoading ? (
              <LoadingSpinner text="Loading user analytics..." />
            ) : userAnalytics && userAnalytics.length > 0 ? (
              <div className="space-y-3">
                {userAnalytics.slice(-5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {item._id.month}/{item._id.day}/{item._id.year}
                    </span>
                    <span className="font-semibold text-blue-600">
                      +{item.count} users
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No user analytics data available</p>
            )}
          </div>

          {/* Food Analytics Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Food Categories</h3>
            {isFoodAnalyticsLoading ? (
              <LoadingSpinner text="Loading food analytics..." />
            ) : foodAnalytics?.categoryStats ? (
              <div className="space-y-3">
                {foodAnalytics.categoryStats.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">
                      {category._id || 'Unknown'}
                    </span>
                    <span className="font-semibold text-green-600">
                      {category.count} items
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No food analytics data available</p>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">System Status</h4>
              <p className="text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">User Engagement</h4>
              <p className="text-blue-600">High</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Data Quality</h4>
              <p className="text-purple-600">Excellent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
