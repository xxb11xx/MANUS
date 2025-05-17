import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api'; // Adjust path as necessary

interface OrderData {
  today: number;
  week: number;
  month: number;
  // avgOrderValueToday?: number; // Post-MVP
  // avgOrderValueWeek?: number; // Post-MVP
}

const OrderSummaryWidget: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This endpoint /api/dashboard/order-summary needs to be created in the backend.
        const response = await apiService.get<OrderData>('/dashboard/order-summary');
        setOrderData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch order summary');
        console.error('Error fetching order summary:', err);
      }
      setIsLoading(false);
    };

    fetchOrderData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
      {isLoading && <p className="text-gray-500">Loading order data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {orderData && !isLoading && !error && (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Orders Today</p>
            <p className="text-2xl font-bold text-blue-600">{orderData.today}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Orders This Week</p>
            <p className="text-2xl font-bold text-blue-600">{orderData.week}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Orders This Month</p>
            <p className="text-2xl font-bold text-blue-600">{orderData.month}</p>
          </div>
          {/* Post-MVP: Average Order Value */}
        </div>
      )}
    </div>
  );
};

export default OrderSummaryWidget;

