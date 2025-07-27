const ActivityList = () => {
  const activities = [
    { name: 'Apple', type: 'Breakfast', calories: 350 },
    { name: ' Sandwich', type: 'Lunch', calories: 450 },
    { name: 'Dose', type: 'Snack', calories: 150 },
    { name: 'Salmon with Roasted Vegetables', type: 'Dinner', calories: 500 },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex justify-between items-center">
          <div>
            <div className="text-white font-medium">{activity.name}</div>
            <div className="text-gray-400 text-sm">{activity.type}</div>
          </div>
          <div className="text-white font-medium">{activity.calories} kcal</div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
