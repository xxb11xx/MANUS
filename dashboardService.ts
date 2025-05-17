import { apiClient } from "./api"; // Assuming a pre-configured apiClient
import { format, addDays, subDays, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

// Define interfaces for the data expected by the widgets
export interface KPIData {
  value: number;
  trendPercentage?: number;
  trendDirection?: "up" | "down" | "neutral";
  trendComparisonPeriod?: string;
  // sparklineData?: number[]; // For future sparkline implementation
}

// Define interface for Order Types Chart data
export interface OrderTypeDataPoint {
  date: string;
  dineIn?: number;
  delivery?: number;
  pickup?: number;
}

// Sales Report Data Interface (consistent with SalesReportPage.tsx)
export interface SalesReportData {
  orderId: string;
  orderDate: string; // ISO string YYYY-MM-DD
  branch: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalSales: number;
  paymentMethod: string;
  orderType: string;
}

// Simulating API calls with placeholder data and a delay
const mockApiCall = <T extends unknown>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export const getOrdersSummaryData = async (): Promise<KPIData> => {
  return mockApiCall<KPIData>({
    value: 1234,
    trendPercentage: 5.6,
    trendDirection: "up",
    trendComparisonPeriod: "vs. yesterday",
  });
};

export const getNetSalesData = async (): Promise<KPIData> => {
  return mockApiCall<KPIData>({
    value: 15789.50,
    trendPercentage: 2.1,
    trendDirection: "up",
    trendComparisonPeriod: "vs. last week",
  });
};

export const getNetPaymentsData = async (): Promise<KPIData> => {
  return mockApiCall<KPIData>({
    value: 15650.00,
    trendPercentage: -0.5,
    trendDirection: "down",
    trendComparisonPeriod: "vs. last week",
  });
};

const generateOrderTypesData = (): OrderTypeDataPoint[] => {
  const data: OrderTypeDataPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'MMM dd');
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dineInBase = isWeekend ? 65 : 40;
    const deliveryBase = isWeekend ? 35 : 45;
    const pickupBase = isWeekend ? 30 : 25;
    const randomFactor = () => 0.8 + Math.random() * 0.4;
    data.push({
      date: formattedDate,
      dineIn: Math.round(dineInBase * randomFactor()),
      delivery: Math.round(deliveryBase * randomFactor()),
      pickup: Math.round(pickupBase * randomFactor())
    });
  }
  return data;
};

const fullOrderTypesDataset = generateOrderTypesData();

export const getOrderTypesChartData = async (
  startDate: Date | null = null, 
  endDate: Date | null = null
): Promise<OrderTypeDataPoint[]> => {
  if (!startDate || !endDate) {
    const today = new Date();
    startDate = subDays(today, 6);
    endDate = today;
  }
  const filteredData = fullOrderTypesDataset.filter(item => {
    const itemDate = new Date(`${item.date}, ${new Date().getFullYear()}`);
    return isWithinInterval(itemDate, { start: startOfDay(startDate!), end: endOfDay(endDate!) });
  });
  return mockApiCall<OrderTypeDataPoint[]>(filteredData);
};

// Mock Sales Report Data (more comprehensive)
const mockFullSalesReportData: SalesReportData[] = [
  { orderId: 'ORD001', orderDate: '2025-05-15', branch: 'Main Street Cafe', productName: 'Espresso', category: 'Beverage', quantity: 2, unitPrice: 3.50, totalSales: 7.00, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD002', orderDate: '2025-05-15', branch: 'Downtown Diner', productName: 'Cheeseburger', category: 'Food', quantity: 1, unitPrice: 12.99, totalSales: 12.99, paymentMethod: 'Cash', orderType: 'Pickup' },
  { orderId: 'ORD003', orderDate: '2025-05-14', branch: 'Main Street Cafe', productName: 'Latte', category: 'Beverage', quantity: 1, unitPrice: 4.50, totalSales: 4.50, paymentMethod: 'Online', orderType: 'Delivery' },
  { orderId: 'ORD004', orderDate: '2025-04-20', branch: 'Main Street Cafe', productName: 'Croissant', category: 'Pastry', quantity: 3, unitPrice: 2.75, totalSales: 8.25, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD005', orderDate: '2025-04-18', branch: 'Downtown Diner', productName: 'Pancakes', category: 'Food', quantity: 1, unitPrice: 9.50, totalSales: 9.50, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD006', orderDate: '2025-05-13', branch: 'Main Street Cafe', productName: 'Orange Juice', category: 'Beverage', quantity: 2, unitPrice: 3.00, totalSales: 6.00, paymentMethod: 'Cash', orderType: 'Pickup' },
  { orderId: 'ORD007', orderDate: '2025-05-12', branch: 'Downtown Diner', productName: 'Chicken Salad', category: 'Food', quantity: 1, unitPrice: 10.50, totalSales: 10.50, paymentMethod: 'Online', orderType: 'Delivery' },
  { orderId: 'ORD008', orderDate: '2025-04-15', branch: 'Main Street Cafe', productName: 'Muffin', category: 'Pastry', quantity: 4, unitPrice: 2.25, totalSales: 9.00, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD009', orderDate: '2025-04-10', branch: 'Downtown Diner', productName: 'Steak Frites', category: 'Food', quantity: 1, unitPrice: 22.00, totalSales: 22.00, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD010', orderDate: '2025-05-11', branch: 'Main Street Cafe', productName: 'Iced Coffee', category: 'Beverage', quantity: 1, unitPrice: 4.00, totalSales: 4.00, paymentMethod: 'Cash', orderType: 'Pickup' },
  // Add more data for robust filtering tests
  { orderId: 'ORD011', orderDate: '2025-05-01', branch: 'Uptown Cafe', productName: 'Bagel with Cream Cheese', category: 'Food', quantity: 2, unitPrice: 4.25, totalSales: 8.50, paymentMethod: 'Card', orderType: 'Pickup' },
  { orderId: 'ORD012', orderDate: '2025-05-02', branch: 'Main Street Cafe', productName: 'Cappuccino', category: 'Beverage', quantity: 1, unitPrice: 4.00, totalSales: 4.00, paymentMethod: 'Online', orderType: 'Delivery' },
  { orderId: 'ORD013', orderDate: '2025-05-03', branch: 'Downtown Diner', productName: 'Club Sandwich', category: 'Food', quantity: 1, unitPrice: 11.50, totalSales: 11.50, paymentMethod: 'Cash', orderType: 'Dine In' },
  { orderId: 'ORD014', orderDate: '2025-05-04', branch: 'Uptown Cafe', productName: 'Scone', category: 'Pastry', quantity: 3, unitPrice: 3.00, totalSales: 9.00, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD015', orderDate: '2025-05-05', branch: 'Main Street Cafe', productName: 'Americano', category: 'Beverage', quantity: 1, unitPrice: 3.00, totalSales: 3.00, paymentMethod: 'Cash', orderType: 'Pickup' },
  { orderId: 'ORD016', orderDate: '2025-05-06', branch: 'Downtown Diner', productName: 'Fish and Chips', category: 'Food', quantity: 1, unitPrice: 14.00, totalSales: 14.00, paymentMethod: 'Online', orderType: 'Delivery' },
  { orderId: 'ORD017', orderDate: '2025-05-07', branch: 'Uptown Cafe', productName: 'Almond Croissant', category: 'Pastry', quantity: 2, unitPrice: 3.50, totalSales: 7.00, paymentMethod: 'Card', orderType: 'Dine In' },
  { orderId: 'ORD018', orderDate: '2025-05-08', branch: 'Main Street Cafe', productName: 'Herbal Tea', category: 'Beverage', quantity: 1, unitPrice: 2.50, totalSales: 2.50, paymentMethod: 'Cash', orderType: 'Pickup' },
  { orderId: 'ORD019', orderDate: '2025-05-09', branch: 'Downtown Diner', productName: 'Pasta Carbonara', category: 'Food', quantity: 1, unitPrice: 16.00, totalSales: 16.00, paymentMethod: 'Online', orderType: 'Delivery' },
  { orderId: 'ORD020', orderDate: '2025-05-10', branch: 'Uptown Cafe', productName: 'Fruit Tart', category: 'Pastry', quantity: 1, unitPrice: 5.00, totalSales: 5.00, paymentMethod: 'Card', orderType: 'Dine In' },
];

export interface SalesReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  branch: string; // 'all' or specific branch name
  paymentMethod: string; // 'all' or specific payment method
  orderType: string; // 'all' or specific order type
}

export const getSalesReportData = async (filters: SalesReportFilters): Promise<SalesReportData[]> => {
  let filteredData = [...mockFullSalesReportData];

  // Filter by date range
  if (filters.startDate && filters.endDate) {
    const rangeStart = startOfDay(filters.startDate);
    const rangeEnd = endOfDay(filters.endDate);
    filteredData = filteredData.filter(item => {
      const itemDate = parseISO(item.orderDate); // Assuming orderDate is 'YYYY-MM-DD'
      return isWithinInterval(itemDate, { start: rangeStart, end: rangeEnd });
    });
  }

  // Filter by branch
  if (filters.branch && filters.branch !== 'all') {
    filteredData = filteredData.filter(item => item.branch === filters.branch);
  }

  // Filter by payment method
  if (filters.paymentMethod && filters.paymentMethod !== 'all') {
    filteredData = filteredData.filter(item => item.paymentMethod === filters.paymentMethod);
  }

  // Filter by order type
  if (filters.orderType && filters.orderType !== 'all') {
    filteredData = filteredData.filter(item => item.orderType === filters.orderType);
  }

  return mockApiCall<SalesReportData[]>(filteredData, 300); // Shorter delay for report data
};

