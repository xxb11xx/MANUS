import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api"; // Adjust path as needed

// Define types (can be shared or imported)
interface Product {
  id: string;
  name: string;
  sku?: string | null;
}

interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface StockAdjustmentFormProps {
  onClose: () => void;
  onAdjustmentSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ onClose, onAdjustmentSuccess }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<string>("");
  const [adjustmentType, setAdjustmentType] = useState<"IN" | "OUT" | "SET">("IN");
  const [quantity, setQuantity] = useState<number | string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiService.get<InventoryItem[]>("/inventory/stock-levels"); // Assuming this endpoint gives all items for selection
        setInventoryItems(response.data);
        if (response.data.length > 0) {
          // setSelectedInventoryItemId(response.data[0].id); // Default to first item - or not
        }
      } catch (err: any) {
        setFetchError("Failed to load inventory items for selection.");
        console.error("Error fetching inventory items:", err);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryItemId || quantity === "" || (adjustmentType !== 'SET' && Number(quantity) <= 0) || (adjustmentType === 'SET' && Number(quantity) < 0) ) {
      setError("Please select an item, enter a valid quantity (>0 for IN/OUT, >=0 for SET), and ensure type is selected.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const payload = {
      inventoryItemId: selectedInventoryItemId,
      adjustmentType,
      quantity: Number(quantity),
      reason: reason || null,
    };

    try {
      await apiService.post("/inventory/stock-levels/adjust", payload);
      onAdjustmentSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit stock adjustment");
      console.error("Error submitting stock adjustment:", err);
    }
    setIsSubmitting(false);
  };

  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <p className="text-red-500">{fetchError} Please try closing and reopening the form.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-6">New Stock Adjustment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="inventoryItemId" className="block text-sm font-medium text-gray-700">Inventory Item</label>
            <select
              id="inventoryItemId"
              name="inventoryItemId"
              value={selectedInventoryItemId}
              onChange={(e) => setSelectedInventoryItemId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select an item</option>
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.product.name} (SKU: {item.product.sku || 'N/A'}) - Current: {item.quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="adjustmentType" className="block text-sm font-medium text-gray-700">Adjustment Type</label>
            <select
              id="adjustmentType"
              name="adjustmentType"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as "IN" | "OUT" | "SET")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="IN">Stock In (Increase)</option>
              <option value="OUT">Stock Out (Decrease)</option>
              <option value="SET">Set Quantity (Override)</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              min={adjustmentType === 'SET' ? 0 : 1} // Allow 0 for SET, but positive for IN/OUT
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting || inventoryItems.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Adjustment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentForm;

