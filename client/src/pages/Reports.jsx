import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(7); // August (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2024);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock data for charts
  const macronutrientData = [
    { date: 'Jul 15', calories: 1650, protein: 120, carbs: 180, fat: 65 },
    { date: 'Jul 22', calories: 1890, protein: 140, carbs: 220, fat: 75 },
    { date: 'Jul 29', calories: 1456, protein: 110, carbs: 160, fat: 58 },
    { date: 'Aug 5', calories: 2100, protein: 165, carbs: 240, fat: 85 },
    { date: 'Aug 12', calories: 1985, protein: 155, carbs: 225, fat: 78 }
  ];

  const calorieDistributionData = [
    { name: 'Protein', value: 30, calories: 630, color: '#84cc16' },
    { name: 'Carbs', value: 40, calories: 840, color: '#22c55e' },
    { name: 'Fat', value: 30, calories: 630, color: '#16a34a' }
  ];

  // Mock calendar data
  const generateCalendarDays = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays(selectedMonth, selectedYear);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Mock daily summary data
  const dailySummary = {
    date: 'August 14, 2024',
    totalCalories: 2100,
    protein: 150,
    carbs: 200,
    fat: 70
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const isActiveDay = (day) => {
    const activeDays = [5, 7, 14, 21, 28];
    return activeDays.includes(day);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-sm sm:text-base text-green-200">Track your progress and visualize your nutrition journey.</p>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-green-700/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-green-100 hover:text-white hover:bg-green-700/50 rounded-lg transition-all duration-200"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex flex-col sm:flex-row sm:space-x-8">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{months[selectedMonth]} {selectedYear}</h3>
              </div>
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{months[(selectedMonth + 1) % 12]} {selectedMonth === 11 ? selectedYear + 1 : selectedYear}</h3>
              </div>
            </div>

            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-green-100 hover:text-white hover:bg-green-700/50 rounded-lg transition-all duration-200"
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {/* Current Month */}
            <div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="text-center text-green-200 text-xs sm:text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm rounded-lg cursor-pointer transition-all duration-200
                      ${day ? (isActiveDay(day) 
                        ? 'bg-lime-400 text-green-900 font-semibold hover:bg-lime-300' 
                        : 'text-green-100 hover:bg-green-700/50'
                      ) : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Month Preview */}
            <div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="text-center text-green-200 text-xs sm:text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {generateCalendarDays((selectedMonth + 1) % 12, selectedMonth === 11 ? selectedYear + 1 : selectedYear).map((day, index) => (
                  <div
                    key={index}
                    className={`
                      h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm rounded-lg cursor-pointer transition-all duration-200
                      ${day ? (isActiveDay(day) 
                        ? 'bg-lime-400 text-green-900 font-semibold hover:bg-lime-300' 
                        : 'text-green-100 hover:bg-green-700/50'
                      ) : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-green-700/50">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Daily Summary</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-green-100 mb-2">{dailySummary.date}</h3>
              <p className="text-sm sm:text-base text-green-200 flex flex-wrap gap-x-4 gap-y-1">
                <span>Total Calories: <span className="font-semibold text-white">{dailySummary.totalCalories}</span></span>
                <span>Protein: <span className="font-semibold text-white">{dailySummary.protein}g</span></span>
                <span>Carbs: <span className="font-semibold text-white">{dailySummary.carbs}g</span></span>
                <span>Fat: <span className="font-semibold text-white">{dailySummary.fat}g</span></span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center" 
                alt="Healthy meal"
                className="w-40 sm:w-48 h-24 sm:h-32 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          {/* Macronutrient Intake Over Time */}
          <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-700/50">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-lime-400 mr-2" size={16} />
              <h3 className="text-base sm:text-lg font-semibold text-white">Macronutrient Intake Over Time</h3>
            </div>
            <div className="mb-4">
              <p className="text-xl sm:text-2xl font-bold text-white">Average: 1800 kcal</p>
              <p className="text-sm sm:text-base text-green-200">Last 30 Days <span className="text-lime-400">+5%</span></p>
            </div>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={macronutrientData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    fontSize={10}
                    className="text-xs sm:text-sm"
                  />
                  <YAxis stroke="#9ca3af" fontSize={10} className="text-xs sm:text-sm" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#84cc16" 
                    strokeWidth={2}
                    dot={{ fill: '#84cc16', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calorie Distribution */}
          <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-700/50">
            <div className="flex items-center mb-4">
              <PieChart className="text-lime-400 mr-2" size={16} />
              <h3 className="text-base sm:text-lg font-semibold text-white">Calorie Distribution</h3>
            </div>
            <div className="mb-4">
              <p className="text-xl sm:text-2xl font-bold text-white">Protein: 30%, Carbs: 40%...</p>
              <p className="text-sm sm:text-base text-green-200">Today <span className="text-red-400">-2%</span></p>
            </div>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={10}
                    className="text-xs sm:text-sm"
                  />
                  <YAxis stroke="#9ca3af" fontSize={10} className="text-xs sm:text-sm" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {calorieDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-around gap-2">
              {calorieDistributionData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-green-100">{item.name}</span>
                  </div>
                  <p className="text-xs text-green-200">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button className="bg-lime-400 hover:bg-lime-500 text-green-900 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-green-800 flex items-center text-sm sm:text-base">
            <Download className="mr-2" size={16} />
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;