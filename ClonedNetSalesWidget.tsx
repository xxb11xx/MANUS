import React from 'react';
import ClonedKPIWidget from './ClonedKPIWidget';

// Mock data for demonstration
const mockNetSalesData = {
  value: '₱ 2,558.04',
  trend: '(+12.1%)',
  trendColor: 'text-green-500',
};

const ClonedNetSalesWidget: React.FC = () => {
  return (
    <ClonedKPIWidget
      title="Net Sales"
      value={mockNetSalesData.value}
      trend={mockNetSalesData.trend}
      trendColor={mockNetSalesData.trendColor}
      viewReportLink="#"
    />
  );
};

export default ClonedNetSalesWidget;

