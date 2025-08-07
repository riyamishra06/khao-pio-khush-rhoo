import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const NutritionChart = ({ 
  data, 
  type = 'bar', 
  title = 'Nutrition Chart',
  height = 400,
  showLegend = true 
}) => {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  // Format data for Chart.js
  const formatChartData = () => {
    const labels = data.data.map(item => {
      if (item._id.day) {
        return `${item._id.month}/${item._id.day}`;
      } else if (item._id.week) {
        return `Week ${item._id.week}`;
      } else if (item._id.month) {
        return `${item._id.month}/${item._id.year}`;
      }
      return 'Unknown';
    });

    const datasets = [
      {
        label: 'Calories',
        data: data.data.map(item => item.calories || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Protein (g)',
        data: data.data.map(item => item.protein || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      },
      {
        label: 'Carbs (g)',
        data: data.data.map(item => item.carbs || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
      },
      {
        label: 'Fat (g)',
        data: data.data.map(item => item.fat || 0),
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
      },
    ];

    return { labels, datasets };
  };

  // Format data for macro distribution (doughnut chart)
  const formatMacroData = () => {
    const totalProtein = data.data.reduce((sum, item) => sum + (item.protein || 0), 0);
    const totalCarbs = data.data.reduce((sum, item) => sum + (item.carbs || 0), 0);
    const totalFat = data.data.reduce((sum, item) => sum + (item.fat || 0), 0);

    return {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [
        {
          data: [totalProtein, totalCarbs, totalFat],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(168, 85, 247, 0.8)',
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(168, 85, 247)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            
            if (label === 'Calories') {
              return `${label}: ${value}`;
            } else {
              return `${label}: ${value}g`;
            }
          },
        },
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        display: true,
        title: {
          display: true,
          text: data.chartType === 'daily' ? 'Date' : 
                data.chartType === 'weekly' ? 'Week' : 'Month',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount',
        },
        beginAtZero: true,
      },
    } : undefined,
  };

  const chartData = type === 'doughnut' ? formatMacroData() : formatChartData();

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  );
};

// Specific chart components
export const CaloriesChart = ({ data, title = 'Daily Calories', ...props }) => (
  <NutritionChart data={data} title={title} {...props} />
);

export const MacroChart = ({ data, title = 'Macronutrient Distribution', ...props }) => (
  <NutritionChart data={data} type="doughnut" title={title} height={300} {...props} />
);

export const TrendChart = ({ data, title = 'Nutrition Trends', ...props }) => (
  <NutritionChart data={data} type="line" title={title} {...props} />
);

export default NutritionChart;
