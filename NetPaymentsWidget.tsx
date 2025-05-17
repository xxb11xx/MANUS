import React, { useEffect, useState } from 'react';
import KPICard from './KPICard';
import { getNetPaymentsData, KPIData } from '../../services/dashboardService';

const NetPaymentsWidget: React.FC = () => {
  const [data, setData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getNetPaymentsData();
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to load net payments data.');
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
        title="Net Payments"
        value="Loading..."
      />
    );
  }

  if (error) {
    return (
      <KPICard
        title="Net Payments"
        value="Error"
        trendComparisonPeriod={error}
      />
    );
  }

  if (!data) {
    return (
      <KPICard
        title="Net Payments"
        value="N/A"
      />
    );
  }

  return (
    <KPICard
      title="Net Payments"
      value={`$${data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      trendPercentage={data.trendPercentage}
      trendDirection={data.trendDirection}
      trendComparisonPeriod={data.trendComparisonPeriod}
      reportLink="/reports/payments" // This can also come from data if dynamic
    />
  );
};

export default NetPaymentsWidget;

