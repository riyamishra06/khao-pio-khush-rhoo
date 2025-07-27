import React from 'react';
import GoalCard from '../components/DashBoard/GoalCard';
import ProgressBar from '../components/DashBoard/ProgressBar';
import ActivityList from '../components/DashBoard/ActivityList';

const Dashboard = () => {
  return (
    <div className="bg-green-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Emily!</h1>
          <p className="text-gray-300">Today is Monday, October 21st</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GoalCard title="Calories Remaining" value="1,850" unit="" />
          <GoalCard title="Protein Goal" value="120" unit="g" />
          <GoalCard title="Fat Goal" value="60" unit="g" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Today's Progress</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Calories Consumed</h3>
                <span className="text-white text-sm">75%</span>
              </div>
              <ProgressBar current="1150" total="1500 kcal" percentage={75} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Protein Intake</h3>
                <span className="text-white text-sm">50%</span>
              </div>
              <ProgressBar current="60" total="120g" percentage={50} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Fat Intake</h3>
                <span className="text-white text-sm">60%</span>
              </div>
              <ProgressBar current="36" total="60g" percentage={60} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          <ActivityList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
