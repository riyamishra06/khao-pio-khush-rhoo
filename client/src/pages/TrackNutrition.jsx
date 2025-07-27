import { useState } from "react";
import NutritionForm from "../components/Tracking/NutritionForm";
import NutritionTable from "../components/Tracking/NutritionTable";
import AddButton from "../components/Tracking/AddButton";

const TrackNutrition = () => {
  const [formData, setFormData] = useState({
    date: '',
    foodItem: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!formData.foodItem) return;
    setItems([...items, formData]);
    setFormData({
      date: '',
      foodItem: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
  };

  const handleDelete = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Daily Nutrition Tracking</h1>
      <NutritionForm formData={formData} handleChange={handleChange} />
      <AddButton onClick={handleAdd} />
      <NutritionTable items={items} onDelete={handleDelete} />
    </div>
  );
};

export default TrackNutrition;
