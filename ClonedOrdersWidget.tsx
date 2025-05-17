import React from 'react';
import ClonedKPIWidget from './ClonedKPIWidget';

// Mock data for demonstration
const mockOrdersData = {
  value: '40',
  trend: '(+2.6%)',
  trendColor: 'text-green-500',
  // sparklineData: [/* ... some data ... */]
};

const ClonedOrdersWidget: React.FC = () => {
  return (
    <ClonedKPIWidget
      title="Orders"
      value={mockOrdersData.value}
      trend={mockOrdersData.trend}
      trendColor={mockOrdersData.trendColor}
      // sparklineData={mockOrdersData.sparklineData} // Pass data if chart is implemented in ClonedKPIWidget
      viewReportLink="#"
    />
  );
};

export default ClonedOrdersWidget;

