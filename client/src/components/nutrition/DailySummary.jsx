import React from 'react';
import { Calendar, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useGetDailySummaryQuery, useGetGoalsProgressQuery } from '../../store/api/nutritionApi';
import { formatDateForAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const DailySummary = ({ date = new Date().toISOString().split('T')[0] }) => {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useGetDailySummaryQuery(date);

  const {
    data: progress,
    isLoading: isProgressLoading,
    error: progressError,
  } = useGetGoalsProgressQuery(date);

  if (isSummaryLoading || isProgressLoading) {
    return <LoadingSpinner text="Loading daily summary..." />;
  }

  if (summaryError || progressError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load daily summary. Please try again.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const ProgressBar = ({ current, goal, label, unit = '' }) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    const isOverGoal = current > goal;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">
            {current}{unit} / {goal}{unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverGoal ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{Math.round(percentage)}% of goal</span>
          {isOverGoal ? (
            <span className="text-red-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Over goal
            </span>
          ) : (
            <span className="text-green-600 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              {goal - current}{unit} remaining
            </span>
          )}
        </div>
      </div>
    );
  };

  const MacroCard = ({ title, current, goal, unit, color }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <Target className={`w-4 h-4 ${color}`} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">
          {current}<span className="text-sm font-normal text-gray-500">{unit}</span>
        </p>
        <p className="text-sm text-gray-600">
          Goal: {goal}{unit}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full ${color.replace('text-', 'bg-')}`}
            style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Daily Summary
        </h2>
        <span className="text-sm text-gray-500">
          {formatDate(date)}
        </span>
      </div>

      {/* Main Macros Grid */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MacroCard
            title="Calories"
            current={progress.consumed.calories}
            goal={progress.goals.calories}
            unit=""
            color="text-blue-600"
          />
          <MacroCard
            title="Protein"
            current={progress.consumed.protein}
            goal={progress.goals.protein}
            unit="g"
            color="text-red-600"
          />
          <MacroCard
            title="Carbs"
            current={progress.consumed.carbs}
            goal={progress.goals.carbs}
            unit="g"
            color="text-yellow-600"
          />
          <MacroCard
            title="Fat"
            current={progress.consumed.fat}
            goal={progress.goals.fat}
            unit="g"
            color="text-purple-600"
          />
        </div>
      )}

      {/* Detailed Progress */}
      {progress && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProgressBar
                current={progress.consumed.calories}
                goal={progress.goals.calories}
                label="Calories"
              />
              <ProgressBar
                current={progress.consumed.protein}
                goal={progress.goals.protein}
                label="Protein"
                unit="g"
              />
              <ProgressBar
                current={progress.consumed.carbs}
                goal={progress.goals.carbs}
                label="Carbohydrates"
                unit="g"
              />
            </div>
            <div className="space-y-4">
              <ProgressBar
                current={progress.consumed.fat}
                goal={progress.goals.fat}
                label="Fat"
                unit="g"
              />
              {progress.consumed.fiber !== undefined && (
                <ProgressBar
                  current={progress.consumed.fiber}
                  goal={progress.goals.fiber}
                  label="Fiber"
                  unit="g"
                />
              )}
              {progress.consumed.sodium !== undefined && (
                <ProgressBar
                  current={progress.consumed.sodium}
                  goal={progress.goals.sodium}
                  label="Sodium"
                  unit="mg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {summary && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {summary.entryCount || 0}
              </p>
              <p className="text-sm text-gray-600">Meals Logged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(summary.totalCalories || 0)}
              </p>
              <p className="text-sm text-gray-600">Total Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {Math.round(summary.totalProtein || 0)}g
              </p>
              <p className="text-sm text-gray-600">Total Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((summary.totalProtein || 0) + (summary.totalCarbs || 0) + (summary.totalFat || 0))}g
              </p>
              <p className="text-sm text-gray-600">Total Macros</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
