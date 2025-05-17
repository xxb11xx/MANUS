import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api'; // Adjust path as necessary

interface SalesData {
  today: number;
  week: number;
  month: number;
}

const SalesSummaryWidget: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real scenario, you might have one endpoint that returns all periods
        // or make separate calls. For MVP, let's assume one endpoint for simplicity.
        // This endpoint /api/dashboard/sales-summary needs to be created in the backend.
        const response = await apiService.get<SalesData>('/dashboard/sales-summary');
        setSalesData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch sales summary');
        console.error('Error fetching sales summary:', err);
      }
      setIsLoading(false);
    };

    fetchSalesData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Summary</h2>
      {isLoading && <p className="text-gray-500">Loading sales data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {salesData && !isLoading && !error && (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-green-600">${salesData.today.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-2xl font-bold text-green-600">${salesData.week.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-green-600">${salesData.month.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSummaryWidget;

