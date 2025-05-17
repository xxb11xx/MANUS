import React, { useEffect, useState } from 'react';
import KPICard from './KPICard';
import { getOrdersSummaryData, KPIData } from '../../services/dashboardService';

const OrdersSummaryWidget: React.FC = () => {
  const [data, setData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getOrdersSummaryData();
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to load orders summary data.');
        setData(null);
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <KPICard
        title="Total Orders"
        value="Loading..."
      />
    );
  }

  if (error) {
    return (
      <KPICard
        title="Total Orders"
        value="Error"
        trendComparisonPeriod={error}
      />
    );
  }

  if (!data) {
    return (
      <KPICard
        title="Total Orders"
        value="N/A"
      />
    );
  }

  return (
    <KPICard
      title="Total Orders"
      value={data.value.toLocaleString()}
      trendPercentage={data.trendPercentage}
      trendDirection={data.trendDirection}
      trendComparisonPeriod={data.trendComparisonPeriod}
      reportLink="/reports/orders" // This can also come from data if dynamic
    />
  );
};

export default OrdersSummaryWidget;

