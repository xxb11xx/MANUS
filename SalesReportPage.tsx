import React, { useState, useMemo, useEffect } from 'react';
import DateRangePicker from '../../../components/common/Filters/DateRangePicker';
import KPICard from '../../../components/dashboard/widgets/KPICard';
import ColumnVisibilityToggle, { ColumnConfig } from '../../../components/common/Table/ColumnVisibilityToggle';
import { useSortableTable, SortConfig } from '../../../hooks/useSortableTable';
import { getSalesReportData, SalesReportData, SalesReportFilters } from '../../../services/dashboardService'; // Import service
import { subDays, format } from 'date-fns';
import { ArrowUp, ArrowDown, Download, FileText, RefreshCw } from 'lucide-react'; // Added RefreshCw for loading

// Define a generic dropdown component for filters
interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  htmlForId: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selectedValue, onChange, htmlForId }) => {
  return (
    <div>
      <label htmlFor={htmlForId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={htmlForId}
        name={htmlForId}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Helper function to convert array of objects to CSV string
const convertToCSV = (data: SalesReportData[], columns: ColumnConfig<SalesReportData>[]) => {
  const visibleColumns = columns.filter(col => col.isVisible);
  const header = visibleColumns.map(col => col.header).join(',');
  const rows = data.map(row => {
    return visibleColumns.map(col => {
      let value = row[col.key as keyof SalesReportData];
      if (col.key === 'orderDate') {
        value = formatDate(value as string, 'yyyy-MM-dd');
      } else if (col.key === 'unitPrice' || col.key === 'totalSales') {
        value = (value as number).toFixed(2);
      }
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  return [header, ...rows].join('\n');
};

const formatDate = (dateString: string, dateFormat: string = 'MMM dd, yyyy') => {
  try {
    return format(new Date(dateString), dateFormat);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original string if formatting fails
  }
};

const SalesReportPage: React.FC = () => {
  const today = new Date();
  const defaultStartDate = subDays(today, 29);
  const defaultEndDate = today;

  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [selectedOrderType, setSelectedOrderType] = useState<string>('all');

  const [reportData, setReportData] = useState<SalesReportData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    { value: 'Main Street Cafe', label: 'Main Street Cafe' },
    { value: 'Downtown Diner', label: 'Downtown Diner' },
    { value: 'Uptown Cafe', label: 'Uptown Cafe' }, // Added from mock data
  ];
  const paymentMethodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'Online', label: 'Online' },
  ];
  const orderTypeOptions = [
    { value: 'all', label: 'All Order Types' },
    { value: 'Dine In', label: 'Dine In' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Pickup', label: 'Pickup' },
  ];

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const filters: SalesReportFilters = {
        startDate,
        endDate,
        branch: selectedBranch,
        paymentMethod: selectedPaymentMethod,
        orderType: selectedOrderType,
      };
      const data = await getSalesReportData(filters);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch sales report data:", error);
      setReportData([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []); // Fetch on initial mount

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleApplyFilters = () => {
    fetchReportData();
  };

  const handleClearFilters = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedBranch('all');
    setSelectedPaymentMethod('all');
    setSelectedOrderType('all');
    // Optionally, re-fetch with default filters immediately or wait for apply
    // For now, we'll let the user click "Apply Filters" to see cleared results
  };

  const summaryKPIs = {
    totalSales: { value: "$125,670.50", trendPercentage: 2.5, trendDirection: "up" as const, trendComparisonPeriod: "vs last month" },
    totalOrders: { value: "8,450", trendPercentage: 1.8, trendDirection: "up" as const, trendComparisonPeriod: "vs last month" },
    avgOrderValue: { value: "$14.87", trendPercentage: -0.5, trendDirection: "down" as const, trendComparisonPeriod: "vs last month" },
    grossProfit: { value: "$75,402.30", trendPercentage: 3.1, trendDirection: "up" as const, trendComparisonPeriod: "vs last month" },
  };

  const initialSalesColumns: ColumnConfig<SalesReportData>[] = [
    { key: 'orderId', header: 'Order ID', isVisible: true },
    { key: 'orderDate', header: 'Date', isVisible: true },
    { key: 'branch', header: 'Branch', isVisible: true },
    { key: 'productName', header: 'Product', isVisible: true },
    { key: 'category', header: 'Category', isVisible: true },
    { key: 'quantity', header: 'Qty', isVisible: true },
    { key: 'unitPrice', header: 'Unit Price', isVisible: true },
    { key: 'totalSales', header: 'Total Sales', isVisible: true },
    { key: 'paymentMethod', header: 'Payment', isVisible: true },
    { key: 'orderType', header: 'Order Type', isVisible: false },
  ];

  const [salesColumns, setSalesColumns] = useState<ColumnConfig<SalesReportData>[]>(initialSalesColumns);
  const { sortedData: sortedSalesData, requestSort: requestSalesSort, sortConfig: salesSortConfig } = useSortableTable<SalesReportData>(reportData, initialSalesColumns);

  const handleSalesVisibilityChange = (updatedColumns: ColumnConfig<SalesReportData>[]) => {
    setSalesColumns(updatedColumns);
  };

  const renderSortIndicator = (key: keyof SalesReportData | string, currentSortConfig: SortConfig<SalesReportData> | null) => {
    if (currentSortConfig?.key === key) {
      if (currentSortConfig.order === 'asc') {
        return <ArrowUp className="inline-block ml-1 h-4 w-4" />;
      } else if (currentSortConfig.order === 'desc') {
        return <ArrowDown className="inline-block ml-1 h-4 w-4" />;
      }
    }
    return null;
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const handleExportCSV = () => {
    const csvData = convertToCSV(sortedSalesData, salesColumns);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPDF = () => {
    console.log('Export PDF clicked. Functionality to be implemented.');
    alert('PDF Export functionality is not yet implemented.');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Sales Report</h1>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangePicker 
              onRangeChange={handleDateRangeChange}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          </div>
          <FilterDropdown label="Branch" htmlForId="branchFilter" options={branchOptions} selectedValue={selectedBranch} onChange={setSelectedBranch} />
          <FilterDropdown label="Payment Method" htmlForId="paymentMethodFilter" options={paymentMethodOptions} selectedValue={selectedPaymentMethod} onChange={setSelectedPaymentMethod} />
          <FilterDropdown label="Order Type" htmlForId="orderTypeFilter" options={orderTypeOptions} selectedValue={selectedOrderType} onChange={setSelectedOrderType} />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Clear Filters</button>
          <button onClick={handleApplyFilters} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center">
            {isLoading && <RefreshCw className="animate-spin h-4 w-4 mr-2" />}
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total Sales" {...summaryKPIs.totalSales} />
          <KPICard title="Total Orders" {...summaryKPIs.totalOrders} />
          <KPICard title="Average Order Value" {...summaryKPIs.avgOrderValue} />
          <KPICard title="Gross Profit" {...summaryKPIs.grossProfit} />
        </div>
      </div>

      {/* Data Visualization Section (Sales Trend Chart) - Placeholder */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend</h2>
        <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">Sales Trend Chart Placeholder</div>
      </div>

      {/* Detailed Sales Table Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 md:mb-0">Detailed Sales</h2>
          <div className="flex space-x-2 items-center">
            <ColumnVisibilityToggle columns={salesColumns} onVisibilityChange={handleSalesVisibilityChange} />
            <button onClick={handleExportCSV} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center"><Download size={14} className="mr-1"/> Export CSV</button>
            <button onClick={handleExportPDF} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center"><FileText size={14} className="mr-1"/> Export PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
              <p className="ml-2 text-gray-600">Loading sales data...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {salesColumns.map((column) => 
                    column.isVisible && (
                      <th 
                        key={String(column.key)} 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSalesSort(column.key)}
                      >
                        {column.header}
                        {renderSortIndicator(column.key, salesSortConfig)}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSalesData.length > 0 ? sortedSalesData.map((item) => (
                  <tr key={item.orderId} className="hover:bg-gray-50">
                    {salesColumns.map((column) => 
                      column.isVisible && (
                        <td key={`${item.orderId}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {column.key === 'unitPrice' || column.key === 'totalSales'
                            ? formatCurrency(item[column.key as keyof SalesReportData] as number)
                            : column.key === 'orderDate'
                            ? formatDate(item[column.key as keyof SalesReportData] as string)
                            : String(item[column.key as keyof SalesReportData])}
                        </td>
                      )
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={salesColumns.filter(c => c.isVisible).length || 1} className="px-6 py-4 text-center text-gray-500">
                      No sales data available for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* Basic Pagination Placeholder - to be enhanced later */}
        {!isLoading && sortedSalesData.length > 0 && (
            <div className="mt-4 flex justify-center text-sm text-gray-600">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 mx-1 disabled:opacity-50" disabled>Previous</button>
                <span className="px-3 py-1">Page 1 of 1 (Mock)</span>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 mx-1 disabled:opacity-50" disabled>Next</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportPage;

