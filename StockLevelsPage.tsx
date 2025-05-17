import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api"; // Adjust path as needed

// Define InventoryItem type based on Prisma schema and backend response
interface Product {
  id: string;
  name: string;
  sku?: string | null;
  // other product fields if needed
}

interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  minStockLevel?: number | null;
  maxStockLevel?: number | null;
  product: Product; // Include product details
  updatedAt: Date;
}

const StockLevelsPage: React.FC = () => {
  const [stockLevels, setStockLevels] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockLevels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<InventoryItem[]>("/inventory/stock-levels");
      setStockLevels(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch stock levels");
      console.error("Error fetching stock levels:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStockLevels();
  }, []);

  if (isLoading && stockLevels.length === 0) return <p className="p-6">Loading stock levels...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory Stock Levels</h1>
        {/* TODO: Add button for stock adjustments if this page will also link to it */}
      </div>

      {error && <p style={{ color: "red" }} className="mb-4">Error: {error}</p>}
      {isLoading && stockLevels.length > 0 && <p className="mb-4">Refreshing stock levels...</p>}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Product Name</th>
              <th className="py-3 px-4 text-left">SKU</th>
              <th className="py-3 px-4 text-right">Current Quantity</th>
              <th className="py-3 px-4 text-right">Min Stock</th>
              <th className="py-3 px-4 text-right">Max Stock</th>
              <th className="py-3 px-4 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {stockLevels.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  No inventory items found or stock levels are all zero.
                </td>
              </tr>
            ) : (
              stockLevels.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.product.name}</td>
                  <td className="py-3 px-4">{item.product.sku || "N/A"}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{item.minStockLevel ?? "N/A"}</td>
                  <td className="py-3 px-4 text-right">{item.maxStockLevel ?? "N/A"}</td>
                  <td className="py-3 px-4">{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockLevelsPage;

