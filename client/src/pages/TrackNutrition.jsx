import React, { useState } from 'react';
import { Trash2, Edit3, Calendar } from 'lucide-react';

const TrackNutrition = () => {
  const [formData, setFormData] = useState({
    date: '',
    foodItem: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [nutritionEntries, setNutritionEntries] = useState([
    {
      id: 1,
      foodItem: 'Apple',
      quantity: '150g',
      calories: 78,
      protein: 0.4,
      carbs: 21,
      fat: 0.2
    },
    {
      id: 2,
      foodItem: 'Chicken Breast',
      quantity: '200g',
      calories: 220,
      protein: 40,
      carbs: 0,
      fat: 5
    },
    {
      id: 3,
      foodItem: 'Brown Rice',
      quantity: '100g',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!formData.foodItem || !formData.quantity) {
      alert('Please fill in at least Food Item and Quantity');
      return;
    }

    const newEntry = {
      id: Date.now(),
      foodItem: formData.foodItem,
      quantity: formData.quantity + (formData.quantity.includes('g') || formData.quantity.includes('ml') ? '' : 'g'),
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0
    };

    setNutritionEntries(prev => [...prev, newEntry]);
    
    // Reset form
    setFormData({
      date: formData.date, // Keep date selected
      foodItem: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
  };

  const handleDelete = (id) => {
    setNutritionEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Daily Nutrition Tracking</h1>
          <div className="w-20 h-1 bg-lime-400 rounded"></div>
        </div>

        {/* Form Section */}
        <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-green-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Field */}
            <div className="lg:col-span-3">
              <label className="block text-green-100 text-sm font-medium mb-3">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
                />
                <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-green-300 pointer-events-none" />
              </div>
            </div>

            {/* Food Item */}
            <div className="lg:col-span-3">
              <label className="block text-green-100 text-sm font-medium mb-3">
                Food Item
              </label>
              <input
                type="text"
                name="foodItem"
                value={formData.foodItem}
                onChange={handleInputChange}
                placeholder="Enter Food Item"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Quantity */}
            <div className="lg:col-span-3">
              <label className="block text-green-100 text-sm font-medium mb-3">
                Quantity (grams/ml)
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter Quantity"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Macronutrients Row 1 */}
            <div>
              <label className="block text-green-100 text-sm font-medium mb-3">
                Calories
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                placeholder="Enter Calories"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-medium mb-3">
                Protein
              </label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                placeholder="Enter Protein"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-medium mb-3">
                Carbs
              </label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                placeholder="Enter Carbs"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Fat field in new row */}
            <div>
              <label className="block text-green-100 text-sm font-medium mb-3">
                Fat
              </label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleInputChange}
                placeholder="Enter Fat"
                className="w-full bg-green-700/50 border border-green-600 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleAdd}
              className="bg-lime-400 hover:bg-lime-500 text-green-900 font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-green-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Added Items Section */}
        <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl border border-green-700/50 overflow-hidden">
          <div className="p-6 border-b border-green-700/50">
            <h2 className="text-xl font-semibold text-white">Added Items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Food Item</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Calories</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Protein</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Carbs</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Fat</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-green-100 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-700/50">
                {nutritionEntries.map((entry, index) => (
                  <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-green-800/20' : 'bg-green-800/40'} hover:bg-green-700/30 transition-colors duration-150`}>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{entry.foodItem}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-100">{entry.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-100">{entry.calories}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-100">{entry.protein}g</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-100">{entry.carbs}g</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-100">{entry.fat}g</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors duration-150">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-150"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {nutritionEntries.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-green-300 text-lg">No nutrition entries added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackNutrition;