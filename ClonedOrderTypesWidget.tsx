import React from 'react';

// Mock data for the chart - in a real app, this would come from props or state
const mockChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  dineIn: [165, 180, 160, 190, 170, 210, 200],
  delivery: [110, 100, 120, 115, 130, 140, 135],
  pickup: [55, 60, 70, 65, 80, 75, 90],
};

// A very simplified SVG chart placeholder. A real chart library (e.g., Recharts, Chart.js) would be used.
const SimpleLineChartPlaceholder: React.FC<{ data: any[] ; color: string; maxY: number }> = ({ data, color, maxY }) => {
  const points = data.map((value, index) => {
    const x = (index / (data.length -1)) * 100; // Scale x to 0-100
    const y = 100 - (value / maxY) * 80; // Scale y, leaving some padding
    return `${x},${y}`;
  }).join(' ');

  return <polyline fill="none" stroke={color} strokeWidth="2" points={points} />;
};

const ClonedOrderTypesWidget: React.FC = () => {
  const maxYValue = 220; // Based on screenshot's y-axis

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-base md:text-lg font-medium text-gray-700 mb-4">Order Types</h3>
      <div className="flex-grow relative">
        {/* Placeholder for Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-500 pr-2" style={{height: 'calc(100% - 40px)'}}>
          <span>{maxYValue}</span>
          <span>{Math.round(maxYValue * 0.75)}</span>
          <span>{Math.round(maxYValue * 0.5)}</span>
          <span>{Math.round(maxYValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Chart Area */}
        <div className="w-full h-64 md:h-80 pl-8 pr-4 relative"> {/* Added padding for Y-axis labels */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines (simplified) */}
            {[0.25, 0.5, 0.75, 1].map(line => (
                <line key={line} x1="0" y1={100 - (line * 80)} x2="100" y2={100 - (line*80)} stroke="#E5E7EB" strokeDasharray="2,2" />
            ))}
            <SimpleLineChartPlaceholder data={mockChartData.dineIn} color="#8B5CF6" maxY={maxYValue} />
            <SimpleLineChartPlaceholder data={mockChartData.delivery} color="#3B82F6" maxY={maxYValue} />
            <SimpleLineChartPlaceholder data={mockChartData.pickup} color="#10B981" maxY={maxYValue} />
          </svg>
        </div>

        {/* Placeholder for X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 pt-2 pl-8 pr-4">
          {mockChartData.labels.map(label => <span key={label}>{label}</span>)}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-purple-500 mr-1.5"></span> Dine In
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span> Delivery
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span> Pickup
        </div>
      </div>
    </div>
  );
};

export default ClonedOrderTypesWidget;

