import React from 'react';
import ClonedKPIWidget from './ClonedKPIWidget';

// Mock data for demonstration
const mockNetPaymentsData = {
  value: '₱ 2,948.01',
  trend: '(+12.4%)',
  trendColor: 'text-green-500',
};

const ClonedNetPaymentsWidget: React.FC = () => {
  return (
    <ClonedKPIWidget
      title="Net Payments"
      value={mockNetPaymentsData.value}
      trend={mockNetPaymentsData.trend}
      trendColor={mockNetPaymentsData.trendColor}
      viewReportLink="#"
    />
  );
};

export default ClonedNetPaymentsWidget;

