import React from 'react';
import ClonedKPIWidget from './ClonedKPIWidget'; // Assuming this is a shared component

// Mock data for demonstration - replace with actual data fetching logic
const mockDiscountAmountData = {
  value: '₱ 393.26',
  trend: '(135.9%)',
  trendColor: 'text-green-500', // Assuming green for positive indication
};

const ClonedDiscountAmountWidget: React.FC = () => {
  return (
    <ClonedKPIWidget
      title="Discount Amount"
      value={mockDiscountAmountData.value}
      trend={mockDiscountAmountData.trend}
      trendColor={mockDiscountAmountData.trendColor}
      viewReportLink="#" // Placeholder for actual link
    />
  );
};

export default ClonedDiscountAmountWidget;

