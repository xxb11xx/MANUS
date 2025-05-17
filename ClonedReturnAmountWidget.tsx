import React from 'react';
import ClonedKPIWidget from './ClonedKPIWidget';

// Mock data for demonstration
const mockReturnAmountData = {
  value: '₱ 0',
  trend: '(N/A%)',
  trendColor: 'text-gray-500',
};

const ClonedReturnAmountWidget: React.FC = () => {
  return (
    <ClonedKPIWidget
      title="Return Amount"
      value={mockReturnAmountData.value}
      trend={mockReturnAmountData.trend}
      trendColor={mockReturnAmountData.trendColor}
      viewReportLink="#"
    />
  );
};

export default ClonedReturnAmountWidget;

