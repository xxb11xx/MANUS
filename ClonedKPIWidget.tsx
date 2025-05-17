import React from 'react';

interface ClonedKPIWidgetProps {
  title: string;
  value: string;
  trend?: string;
  trendColor?: string; // e.g., 'text-green-500' or 'text-red-500'
  sparklineData?: number[]; // Simplified for now, actual chart would be more complex
  viewReportLink?: string;
}

const ClonedKPIWidget: React.FC<ClonedKPIWidgetProps> = ({
  title,
  value,
  trend,
  trendColor = 'text-gray-500',
  // sparklineData,
  viewReportLink = '#',
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {viewReportLink && (
          <a href={viewReportLink} className="text-xs text-purple-600 hover:text-purple-800">
            View Report
          </a>
        )}
      </div>
      <div className="mt-auto">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {trend && (
          <p className={`text-xs ${trendColor}`}>{trend}</p>
        )}
        {/* TODO: Implement Sparkline Chart if sparklineData is provided */}
        {/* For now, a placeholder for the chart area */}
        <div className="mt-3 h-10 bg-gray-50 rounded flex items-center justify-center">
          {/* Simplified sparkline representation or actual chart component here */}
          <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#8B5CF6" // Purple color from screenshot
              strokeWidth="1"
              points="0,15 10,10 20,12 30,8 40,10 50,15 60,12 70,18 80,15 90,10 100,12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ClonedKPIWidget;

