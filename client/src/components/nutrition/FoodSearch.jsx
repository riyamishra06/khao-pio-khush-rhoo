import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useSearchFoodsQuery, useGetPopularFoodsQuery } from '../../store/api/foodApi';
import { debounce } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const FoodSearch = ({ onSelectFood, selectedFoods = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Debounce search query
  useEffect(() => {
    const debouncedSearch = debounce((query) => {
      setDebouncedQuery(query);
    }, 300);

    debouncedSearch(searchQuery);
  }, [searchQuery]);

  // API queries
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchFoodsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  const {
    data: popularFoods,
    isLoading: isPopularLoading,
  } = useGetPopularFoodsQuery(10);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(query.length >= 2);
  };

  const handleSelectFood = (food) => {
    onSelectFood(food);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleRemoveFood = (foodId) => {
    // This would be handled by parent component
    console.log('Remove food:', foodId);
  };

  const displayFoods = debouncedQuery.length >= 2 ? searchResults : popularFoods;
  const isLoading = debouncedQuery.length >= 2 ? isSearchLoading : isPopularLoading;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for foods..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(searchQuery.length >= 2)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4">
                <LoadingSpinner size="small" text="Searching foods..." />
              </div>
            ) : searchError ? (
              <div className="p-4 text-red-600 text-center">
                Error searching foods. Please try again.
              </div>
            ) : displayFoods && displayFoods.length > 0 ? (
              <div className="py-2">
                {debouncedQuery.length < 2 && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Popular Foods
                  </div>
                )}
                {displayFoods.map((food) => (
                  <button
                    key={food._id}
                    onClick={() => handleSelectFood(food)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {food.displayName || food.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {food.category} • {food.servingSize}{food.servingUnit}
                        </p>
                        <div className="flex space-x-4 text-xs text-gray-400 mt-1">
                          <span>{food.nutritionPer100g.calories} cal</span>
                          <span>{food.nutritionPer100g.protein}g protein</span>
                          <span>{food.nutritionPer100g.carbs}g carbs</span>
                          <span>{food.nutritionPer100g.fat}g fat</span>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500 text-center">
                {debouncedQuery.length >= 2 
                  ? 'No foods found. Try a different search term.'
                  : 'Start typing to search for foods...'
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Foods */}
      {selectedFoods.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Foods</h4>
          <div className="space-y-2">
            {selectedFoods.map((food, index) => (
              <div
                key={`${food._id}-${index}`}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">
                    {food.displayName || food.name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {food.quantity} • {food.calories} calories
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFood(food._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default FoodSearch;
