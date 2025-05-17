import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { OrderStatus, PaymentStatus, OrderType } from "@prisma/client"; // Assuming these enums are available

const OrdersListPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.getOrders(); // Ensure getOrders is defined in api.ts
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "bg-yellow-200 text-yellow-800";
      case OrderStatus.CONFIRMED: return "bg-blue-200 text-blue-800";
      case OrderStatus.PREPARING: return "bg-indigo-200 text-indigo-800";
      case OrderStatus.READY_FOR_PICKUP: return "bg-purple-200 text-purple-800";
      case OrderStatus.OUT_FOR_DELIVERY: return "bg-pink-200 text-pink-800";
      case OrderStatus.DELIVERED: return "bg-green-200 text-green-800";
      case OrderStatus.COMPLETED: return "bg-green-200 text-green-800";
      case OrderStatus.CANCELED: return "bg-red-200 text-red-800";
      case OrderStatus.ON_HOLD: return "bg-gray-200 text-gray-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return "bg-green-200 text-green-800";
      case PaymentStatus.UNPAID: return "bg-red-200 text-red-800";
      case PaymentStatus.PARTIALLY_PAID: return "bg-yellow-200 text-yellow-800";
      case PaymentStatus.REFUNDED: return "bg-gray-200 text-gray-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  if (loading && !orders.length) return <DashboardLayout><div>Loading orders...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Orders</h1>
          {/* TODO: Add "Create New Order" button if applicable for admin dashboard MVP */}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={fetchOrders} className="ml-4 text-sm text-blue-500 underline">Try Again</button>
          </div>
        )}

        {!orders.length && !loading && (
             <div className="text-center text-gray-500 py-10">
                <p>No orders found.</p>
            </div>
        )}

        {orders.length > 0 && (
          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Branch</th>
                  <th className="py-3 px-6 text-left">Cashier</th>
                  <th className="py-3 px-6 text-center">Type</th>
                  <th className="py-3 px-6 text-right">Total</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Payment</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                        <Link to={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                            {order.id.substring(0,8)}...
                        </Link>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{order.branch?.name || "N/A"}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{order.user?.name || "N/A"}</td>
                    <td className="py-3 px-6 text-center">{order.orderType}</td>
                    <td className="py-3 px-6 text-right">{typeof order.totalAmount === "number" ? order.totalAmount.toFixed(2) : order.totalAmount}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-6 text-center">
                      <Link to={`/dashboard/orders/${order.id}`} className="text-purple-600 hover:text-purple-800 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersListPage;

