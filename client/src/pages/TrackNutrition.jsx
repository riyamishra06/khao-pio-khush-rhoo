import React, { useState } from "react";
import { Plus, Calendar, TrendingUp, Filter } from "lucide-react";
import {
  useGetNutritionEntriesQuery,
  useDeleteNutritionEntryMutation,
} from "../store/api/nutritionApi";
import { toast } from "react-hot-toast";
import DailySummary from "../components/nutrition/DailySummary";
import NutritionEntryForm from "../components/nutrition/NutritionEntryForm";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TrackNutrition = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [mealTypeFilter, setMealTypeFilter] = useState("");

  // API queries and mutations
  const {
    data: entriesData,
    isLoading: isEntriesLoading,
    error: entriesError,
    refetch: refetchEntries,
  } = useGetNutritionEntriesQuery({
    startDate: selectedDate,
    endDate: selectedDate,
    mealType: mealTypeFilter || undefined,
  });

  const [deleteEntry, { isLoading: isDeleting }] =
    useDeleteNutritionEntryMutation();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAddEntry = () => {
    setShowAddForm(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
  };

  const handleDeleteEntry = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this nutrition entry?")
    ) {
      try {
        await deleteEntry(id).unwrap();
        toast.success("Nutrition entry deleted successfully!");
        refetchEntries();
      } catch (error) {
        toast.error("Failed to delete nutrition entry");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingEntry(null);
    refetchEntries();
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const formatMealTime = (createdAt) => {
    return new Date(createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      breakfast: "bg-yellow-100 text-yellow-800",
      lunch: "bg-blue-100 text-blue-800",
      dinner: "bg-purple-100 text-purple-800",
      snack: "bg-green-100 text-green-800",
    };
    return colors[mealType] || "bg-gray-100 text-gray-800";
  };

  const nutritionEntries = entriesData?.entries || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nutrition Tracking
              </h1>
              <p className="text-gray-600">
                Track your daily nutrition and monitor your progress
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {/* Date Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {/* Add Entry Button */}
              <button
                onClick={handleAddEntry}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <DailySummary date={selectedDate} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        {/* Nutrition Entries */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Nutrition Entries for{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </h2>
          </div>

          {isEntriesLoading ? (
            <div className="p-8">
              <LoadingSpinner text="Loading nutrition entries..." />
            </div>
          ) : entriesError ? (
            <div className="p-8 text-center">
              <p className="text-red-600">
                Failed to load nutrition entries. Please try again.
              </p>
              {entriesError.data?.error &&
                (Array.isArray(entriesError.data.error) ? (
                  entriesError.data.error.map((err, idx) => (
                    <div key={idx} className="text-red-500 text-sm">
                      {err.message}
                    </div>
                  ))
                ) : (
                  <div className="text-red-500 text-sm">
                    {entriesError.data.error.message ||
                      JSON.stringify(entriesError.data.error)}
                  </div>
                ))}
            </div>
          ) : nutritionEntries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                No nutrition entries found for this date.
              </p>
              <button
                onClick={handleAddEntry}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Entry</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meal Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protein
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carbs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nutritionEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.foodItem}
                        </div>
                        {entry.notes && (
                          <div className="text-sm text-gray-500">
                            {entry.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMealTypeColor(
                            entry.mealType
                          )}`}
                        >
                          {entry.mealType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.protein}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.carbs}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.fat}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatMealTime(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry._id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddForm && (
          <NutritionEntryForm
            defaultDate={selectedDate}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {editingEntry && (
          <NutritionEntryForm
            entry={editingEntry}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default TrackNutrition;
