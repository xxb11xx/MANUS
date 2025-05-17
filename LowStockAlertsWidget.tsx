import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import { apiService } from '../../services/api'; // Adjust path as necessary

interface LowStockItem {
  id: string;
  productId: string;
  productName: string;
  currentQuantity: number;
  minStockLevel: number;
}

const LowStockAlertsWidget: React.FC = () => {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This endpoint /api/dashboard/low-stock-alerts needs to be created in the backend.
        // It should accept parameters like limit (e.g., ?limit=5)
        const response = await apiService.get<LowStockItem[]>('/dashboard/low-stock-alerts?limit=5');
        setLowStockItems(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch low stock alerts');
        console.error('Error fetching low stock alerts:', err);
      }
      setIsLoading(false);
    };

    fetchLowStockItems();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Low Stock Alerts</h2>
        <Link to="/inventory/stock-levels" className="text-sm text-blue-600 hover:underline">
          View All Inventory
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Loading low stock items...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <ul className="space-y-2">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-red-50 hover:bg-red-100">
                <div>
                  <span className="font-semibold text-red-700">{item.productName}</span>
                  <p className="text-xs text-gray-500">Current: {item.currentQuantity} (Min: {item.minStockLevel})</p>
                </div>
                <Link to={`/inventory/adjustments?productId=${item.productId}`} className="text-xs text-blue-500 hover:text-blue-700">
                    Adjust Stock
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No items currently low on stock.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default LowStockAlertsWidget;

