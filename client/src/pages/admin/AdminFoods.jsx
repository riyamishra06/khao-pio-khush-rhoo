import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Filter } from 'lucide-react';
import { 
  useGetAllFoodsQuery, 
  useCreateFoodMutation, 
  useUpdateFoodMutation, 
  useDeleteFoodMutation,
  useVerifyFoodMutation 
} from '../../store/api/foodApi';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminFoods = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isVerified: '',
    page: 1,
    limit: 20,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    data: foodsData,
    isLoading,
    error,
    refetch,
  } = useGetAllFoodsQuery(filters);

  const [createFood, { isLoading: isCreating }] = useCreateFoodMutation();
  const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();
  const [deleteFood, { isLoading: isDeleting }] = useDeleteFoodMutation();
  const [verifyFood, { isLoading: isVerifying }] = useVerifyFoodMutation();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleDeleteFood = async (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to delete "${foodName}"? This action cannot be undone.`)) {
      try {
        await deleteFood(foodId).unwrap();
        toast.success('Food deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  const handleVerifyFood = async (foodId, isVerified) => {
    try {
      await verifyFood({
        id: foodId,
        isVerified: !isVerified,
        verificationNotes: !isVerified ? 'Verified by admin' : 'Unverified by admin'
      }).unwrap();
      toast.success(`Food ${!isVerified ? 'verified' : 'unverified'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      fruits: 'bg-red-100 text-red-800',
      vegetables: 'bg-green-100 text-green-800',
      grains: 'bg-yellow-100 text-yellow-800',
      proteins: 'bg-blue-100 text-blue-800',
      dairy: 'bg-purple-100 text-purple-800',
      nuts_seeds: 'bg-orange-100 text-orange-800',
      beverages: 'bg-cyan-100 text-cyan-800',
      snacks: 'bg-pink-100 text-pink-800',
      fast_food: 'bg-red-100 text-red-800',
      desserts: 'bg-indigo-100 text-indigo-800',
      oils_fats: 'bg-amber-100 text-amber-800',
      spices_herbs: 'bg-lime-100 text-lime-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  const foods = foodsData?.foods || [];
  const pagination = foodsData?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Management</h1>
              <p className="text-gray-600">Manage food database and verify food items</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search foods..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="grains">Grains</option>
              <option value="proteins">Proteins</option>
              <option value="dairy">Dairy</option>
              <option value="nuts_seeds">Nuts & Seeds</option>
              <option value="beverages">Beverages</option>
              <option value="snacks">Snacks</option>
              <option value="fast_food">Fast Food</option>
              <option value="desserts">Desserts</option>
              <option value="oils_fats">Oils & Fats</option>
              <option value="spices_herbs">Spices & Herbs</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.isVerified}
              onChange={(e) => handleFilterChange('isVerified', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Foods Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Foods ({pagination.total || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8">
              <LoadingSpinner text="Loading foods..." />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Failed to load foods. Please try again.</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No foods found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nutrition (per 100g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {foods.map((food) => (
                    <tr key={food._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {food.displayName || food.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {food.brand && `${food.brand} • `}
                            {food.servingSize}{food.servingUnit}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(food.category)}`}>
                          {food.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{food.nutritionPer100g.calories} cal</div>
                          <div className="text-xs text-gray-500">
                            P: {food.nutritionPer100g.protein}g • 
                            C: {food.nutritionPer100g.carbs}g • 
                            F: {food.nutritionPer100g.fat}g
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            food.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {food.isVerified ? 'Verified' : 'Pending'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            food.isPublic 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {food.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {food.usageCount || 0} times
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyFood(food._id, food.isVerified)}
                            disabled={isVerifying}
                            className={`${
                              food.isVerified 
                                ? 'text-yellow-600 hover:text-yellow-900' 
                                : 'text-green-600 hover:text-green-900'
                            } disabled:opacity-50`}
                          >
                            {food.isVerified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food._id, food.name)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-green-600 text-white rounded">
                    {pagination.page}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFoods;
