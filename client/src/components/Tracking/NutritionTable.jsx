const NutritionTable = ({ items, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-green-900 text-white border rounded">
        <thead>
          <tr className="text-left">
            <th className="p-2">Food Item</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Calories</th>
            <th className="p-2">Protein</th>
            <th className="p-2">Carbs</th>
            <th className="p-2">Fat</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-t border-green-700">
              <td className="p-2">{item.foodItem}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.calories}</td>
              <td className="p-2">{item.protein}</td>
              <td className="p-2">{item.carbs}</td>
              <td className="p-2">{item.fat}</td>
              <td className="p-2 text-lime-300 cursor-pointer" onClick={() => onDelete(idx)}>Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NutritionTable;
