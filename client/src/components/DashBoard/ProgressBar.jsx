const ProgressBar = ({ current, total, percentage, color = "bg-green-500" }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-right text-white text-sm font-medium">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-green-900 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-400 mt-1">
        <span>
          {current} / {total}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
