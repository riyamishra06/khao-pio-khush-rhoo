import React from 'react';

const NutritionRow = ({ item, onDelete }) => {
  return (
    <tr className="border-b border-green-700 last:border-b-0">
      <td className="px-6 py-4 text-white">{item.foodItem}</td>
      <td className="px-6 py-4 text-white">{item.quantity}</td>
      <td className="px-6 py-4 text-white">{item.calories}</td>
      <td className="px-6 py-4 text-white">{item.protein}</td>
      <td className="px-6 py-4 text-white">{item.carbs}</td>
      <td className="px-6 py-4 text-white">{item.fat}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-white">Edit /</button>
          <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-400">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default NutritionRow;
