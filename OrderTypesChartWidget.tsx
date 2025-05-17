import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { subDays } from 'date-fns';
import DateRangePicker from '../../common/Filters/DateRangePicker';
import { getOrderTypesChartData, OrderTypeDataPoint } from '../../../services/dashboardService';

interface OrderTypesChartWidgetProps {
  title?: string;
}

const OrderTypesChartWidget: React.FC<OrderTypesChartWidgetProps> = ({ title = "Order Types Trend" }) => {
  // Default date range: last 7 days
  const today = new Date();
  const defaultStartDate = subDays(today, 6);
  const defaultEndDate = today;
  
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [data, setData] = useState<OrderTypeDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on date range
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getOrderTypesChartData(startDate, endDate);
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to load order types chart data.');
        setData([]);
        console.error(err);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [startDate, endDate]);

  // Handle date range changes from the DateRangePicker
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="flex justify-end mb-4">
          <DateRangePicker 
            onRangeChange={handleDateRangeChange}
            initialStartDate={defaultStartDate}
            initialEndDate={defaultEndDate}
          />
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="flex justify-end mb-4">
          <DateRangePicker 
            onRangeChange={handleDateRangeChange}
            initialStartDate={defaultStartDate}
            initialEndDate={defaultEndDate}
          />
        </div>
        <div className="flex items-center justify-center h-[300px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="flex justify-end mb-4">
          <DateRangePicker 
            onRangeChange={handleDateRangeChange}
            initialStartDate={defaultStartDate}
            initialEndDate={defaultEndDate}
          />
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No order type data available for the selected period.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">{title}</h3>
        <DateRangePicker 
          onRangeChange={handleDateRangeChange}
          initialStartDate={defaultStartDate}
          initialEndDate={defaultEndDate}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '0.375rem' }}
            labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            itemStyle={{ color: '#FFFFFF' }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}/>
          <Line type="monotone" dataKey="dineIn" name="Dine In" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="delivery" name="Delivery" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="pickup" name="Pickup" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderTypesChartWidget;

