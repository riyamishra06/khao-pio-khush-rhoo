import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateNutritionEntryMutation, useUpdateNutritionEntryMutation } from '../../store/api/nutritionApi';
import { nutritionEntrySchema } from '../../utils/validation';
import { formatDateForAPI } from '../../utils/api';
import FoodSearch from './FoodSearch';
import LoadingSpinner from '../common/LoadingSpinner';

const NutritionEntryForm = ({ 
  entry = null, 
  onClose, 
  onSuccess,
  defaultDate = new Date().toISOString().split('T')[0]
}) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [calculatedNutrition, setCalculatedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  });

  const isEditing = !!entry;

  const [createEntry, { isLoading: isCreating }] = useCreateNutritionEntryMutation();
  const [updateEntry, { isLoading: isUpdating }] = useUpdateNutritionEntryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(nutritionEntrySchema),
    defaultValues: {
      date: defaultDate,
      foodItem: '',
      quantity: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      mealType: 'snack',
      notes: '',
    },
  });

  // Watch quantity changes to recalculate nutrition
  const quantity = watch('quantity');

  // Load entry data if editing
  useEffect(() => {
    if (entry) {
      reset({
        date: formatDateForAPI(entry.date),
        foodItem: entry.foodItem,
        quantity: entry.quantity,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        fiber: entry.fiber || 0,
        sugar: entry.sugar || 0,
        sodium: entry.sodium || 0,
        mealType: entry.mealType,
        notes: entry.notes || '',
      });
    }
  }, [entry, reset]);

  // Calculate nutrition based on selected food and quantity
  useEffect(() => {
    if (selectedFood && quantity) {
      const quantityNum = parseFloat(quantity.replace(/[^\d.]/g, ''));
      if (!isNaN(quantityNum) && quantityNum > 0) {
        const multiplier = quantityNum / 100; // Nutrition is per 100g
        
        const calculated = {
          calories: Math.round(selectedFood.nutritionPer100g.calories * multiplier),
          protein: Math.round(selectedFood.nutritionPer100g.protein * multiplier * 10) / 10,
          carbs: Math.round(selectedFood.nutritionPer100g.carbs * multiplier * 10) / 10,
          fat: Math.round(selectedFood.nutritionPer100g.fat * multiplier * 10) / 10,
          fiber: Math.round((selectedFood.nutritionPer100g.fiber || 0) * multiplier * 10) / 10,
          sugar: Math.round((selectedFood.nutritionPer100g.sugar || 0) * multiplier * 10) / 10,
          sodium: Math.round((selectedFood.nutritionPer100g.sodium || 0) * multiplier),
        };

        setCalculatedNutrition(calculated);
        
        // Update form values
        Object.keys(calculated).forEach(key => {
          setValue(key, calculated[key]);
        });
      }
    }
  }, [selectedFood, quantity, setValue]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setValue('foodItem', food.displayName || food.name);
    
    // Set default quantity based on serving size
    const defaultQuantity = `${food.servingSize}${food.servingUnit}`;
    setValue('quantity', defaultQuantity);
  };

  const onSubmit = async (data) => {
    try {
      const entryData = {
        ...data,
        foodId: selectedFood?._id || null,
      };

      if (isEditing) {
        await updateEntry({ id: entry._id, ...entryData }).unwrap();
        toast.success('Nutrition entry updated successfully!');
      } else {
        await createEntry(entryData).unwrap();
        toast.success('Nutrition entry added successfully!');
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to save nutrition entry');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Nutrition Entry' : 'Add Nutrition Entry'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Date and Meal Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Meal Type
                </label>
                <select
                  {...register('mealType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            {/* Food Search */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Food
                </label>
                <FoodSearch onSelectFood={handleFoodSelect} />
              </div>
            )}

            {/* Food Item and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Item
                </label>
                <input
                  type="text"
                  {...register('foodItem')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.foodItem ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Apple, Chicken Breast"
                />
                {errors.foodItem && (
                  <p className="text-red-500 text-sm mt-1">{errors.foodItem.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  {...register('quantity')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 100g, 1 cup, 2 pieces"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            {/* Nutrition Values */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrition Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    step="1"
                    {...register('calories', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('protein', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('carbs', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('fat', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any additional notes about this meal..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Entry' : 'Add Entry'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NutritionEntryForm;
