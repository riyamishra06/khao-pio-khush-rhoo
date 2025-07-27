const NutritionForm = ({ formData, handleChange }) => {
  return (
    <div className="grid gap-4 mb-6">
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="bg-green-900 p-2 rounded" />
      <input type="text" name="foodItem" placeholder="Enter Food Item" value={formData.foodItem} onChange={handleChange} className="bg-green-900 p-2 rounded" />
      <input type="text" name="quantity" placeholder="Enter Quantity" value={formData.quantity} onChange={handleChange} className="bg-green-900 p-2 rounded" />
      
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="calories" placeholder="Calories" value={formData.calories} onChange={handleChange} className="bg-green-900 p-2 rounded" />
        <input type="text" name="protein" placeholder="Protein" value={formData.protein} onChange={handleChange} className="bg-green-900 p-2 rounded" />
        <input type="text" name="carbs" placeholder="Carbs" value={formData.carbs} onChange={handleChange} className="bg-green-900 p-2 rounded" />
        <input type="text" name="fat" placeholder="Fat" value={formData.fat} onChange={handleChange} className="bg-green-900 p-2 rounded" />
      </div>
    </div>
  );
};

export default NutritionForm;
