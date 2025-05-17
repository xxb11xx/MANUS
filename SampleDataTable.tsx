import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import ColumnVisibilityToggle, { ColumnConfig } from '../common/Table/ColumnVisibilityToggle';
import { useSortableTable, SortConfig } from '../../hooks/useSortableTable';

// Sample data interface
interface SalesData {
  id: number;
  product: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
}

// Mock data for the table
const mockSalesData: SalesData[] = [
  { id: 1, product: 'Burger Deluxe', category: 'Food', price: 12.99, quantity: 25, total: 324.75, date: '2025-05-01' },
  { id: 2, product: 'Chicken Wings', category: 'Food', price: 9.99, quantity: 40, total: 399.60, date: '2025-05-02' },
  { id: 3, product: 'Caesar Salad', category: 'Food', price: 8.50, quantity: 15, total: 127.50, date: '2025-05-03' },
  { id: 4, product: 'Coca Cola', category: 'Beverage', price: 2.50, quantity: 60, total: 150.00, date: '2025-05-01' },
  { id: 5, product: 'Iced Tea', category: 'Beverage', price: 2.99, quantity: 45, total: 134.55, date: '2025-05-02' },
  { id: 6, product: 'Cheesecake', category: 'Dessert', price: 6.99, quantity: 20, total: 139.80, date: '2025-05-03' },
  { id: 7, product: 'French Fries', category: 'Side', price: 3.99, quantity: 50, total: 199.50, date: '2025-05-01' },
  { id: 8, product: 'Pizza Margherita', category: 'Food', price: 14.99, quantity: 30, total: 449.70, date: '2025-05-02' },
];

const SampleDataTable: React.FC = () => {
  // Initial column configuration
  const initialColumns: ColumnConfig<SalesData>[] = [
    { key: 'id', header: 'ID', isVisible: true },
    { key: 'product', header: 'Product', isVisible: true },
    { key: 'category', header: 'Category', isVisible: true },
    { key: 'price', header: 'Price', isVisible: true },
    { key: 'quantity', header: 'Quantity', isVisible: true },
    { key: 'total', header: 'Total', isVisible: true },
    { key: 'date', header: 'Date', isVisible: true },
  ];

  // State for column visibility
  const [columns, setColumns] = useState<ColumnConfig<SalesData>[]>(initialColumns);
  
  // Use the sortable table hook
  const { sortedData, requestSort, sortConfig } = useSortableTable<SalesData>(mockSalesData);

  // Handle column visibility changes
  const handleVisibilityChange = (updatedColumns: ColumnConfig<SalesData>[]) => {
    setColumns(updatedColumns);
  };

  // Render sort indicator
  const renderSortIndicator = (key: keyof SalesData | string) => {
    if (sortConfig?.key === key) {
      if (sortConfig.order === 'asc') {
        return <ArrowUp className="inline-block ml-1 h-4 w-4" />;
      } else if (sortConfig.order === 'desc') {
        return <ArrowDown className="inline-block ml-1 h-4 w-4" />;
      }
    }
    return null;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">Sales Data</h3>
        <ColumnVisibilityToggle 
          columns={columns} 
          onVisibilityChange={handleVisibilityChange} 
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => 
                column.isVisible && (
                  <th 
                    key={String(column.key)} 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort(column.key)}
                  >
                    {column.header}
                    {renderSortIndicator(column.key)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => 
                  column.isVisible && (
                    <td key={`${item.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.key === 'price' || column.key === 'total' 
                        ? formatCurrency(item[column.key as keyof SalesData] as number)
                        : String(item[column.key as keyof SalesData])}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleDataTable;
