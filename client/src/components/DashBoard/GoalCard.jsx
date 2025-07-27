const GoalCard = ({ title, value, unit }) => {
  return (
    <div className="bg-green-800 rounded-lg p-6">
      <h3 className="text-gray-300 text-sm mb-2">{title}</h3>
      <div className="text-white text-3xl font-bold">
        {value}
        <span className="text-lg">{unit}</span>
      </div>
    </div>
  );
};

export default GoalCard;
