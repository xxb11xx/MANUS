import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { OrderStatus, PaymentStatus, OrderType } from "@prisma/client";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.getOrderById(orderId); // Ensure getOrderById is defined in api.ts
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError("Failed to fetch order details. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status: OrderStatus | undefined) => {
    if (!status) return "bg-gray-200 text-gray-800";
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

  const getPaymentStatusColor = (status: PaymentStatus | undefined) => {
    if (!status) return "bg-gray-200 text-gray-800";
    switch (status) {
      case PaymentStatus.PAID: return "bg-green-200 text-green-800";
      case PaymentStatus.UNPAID: return "bg-red-200 text-red-800";
      case PaymentStatus.PARTIALLY_PAID: return "bg-yellow-200 text-yellow-800";
      case PaymentStatus.REFUNDED: return "bg-gray-200 text-gray-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  
  // Function to handle order status update
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order || !orderId) return;
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            fetchOrderDetails(); // Refresh order details
        } catch (err) {
            console.error("Failed to update order status:", err);
            setError("Failed to update order status. Please try again.");
        }
    }
  };


  if (loading) return <DashboardLayout><div>Loading order details...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div>Error: {error} <button onClick={fetchOrderDetails} className="text-blue-500 underline">Try Again</button></div></DashboardLayout>;
  if (!order) return <DashboardLayout><div>Order not found. <Link to="/dashboard/orders" className="text-blue-500 underline">Go back to orders list</Link></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
            <Link to="/dashboard/orders" className="text-blue-600 hover:text-blue-800 hover:underline">&larr; Back to Orders List</Link>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Details: {order.id}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Information</h3>
              <p><strong>Branch:</strong> {order.branch?.name || "N/A"}</p>
              <p><strong>Cashier:</strong> {order.user?.name || "N/A"}</p>
              <p><strong>Order Type:</strong> {order.orderType}</p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Status & Payment</h3>
              <p><strong>Order Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></p>
              <p><strong>Payment Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span></p>
              <p className="text-xl font-bold mt-2"><strong>Total Amount:</strong> {typeof order.totalAmount === "number" ? order.totalAmount.toFixed(2) : order.totalAmount} {order.currency || "SAR"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Update Order Status</h3>
            <div className="flex space-x-2">
                {Object.values(OrderStatus).map(statusValue => (
                    <button 
                        key={statusValue}
                        onClick={() => handleUpdateStatus(statusValue as OrderStatus)}
                        disabled={order.status === statusValue}
                        className={`px-3 py-1 rounded text-sm font-medium focus:outline-none 
                                    ${order.status === statusValue 
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                                        : `${getStatusColor(statusValue as OrderStatus).replace("bg-", "hover:bg-").replace("-200", "-300")} ${getStatusColor(statusValue as OrderStatus)}`}
                                  `}
                    >
                        Set to {statusValue}
                    </button>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items ({order.items?.length || 0})</h3>
            {order.items && order.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-right">Total Price</th>
                      <th className="px-4 py-2 text-left">Notes</th>
                      <th className="px-4 py-2 text-left">Modifiers</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">{item.product?.name} ({item.product?.nameAr})</td>
                        <td className="px-4 py-2 text-right">{typeof item.unitPrice === "number" ? item.unitPrice.toFixed(2) : item.unitPrice}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">{typeof item.totalPrice === "number" ? item.totalPrice.toFixed(2) : item.totalPrice}</td>
                        <td className="px-4 py-2">{item.notes || "-"}</td>
                        <td className="px-4 py-2">
                          {item.selectedModifiers && item.selectedModifiers.length > 0 ? (
                            item.selectedModifiers.map((sm: any) => (
                              <div key={sm.id} className="text-xs">
                                {sm.modifierOption?.modifierGroup?.name}: {sm.modifierOption?.name} 
                                ({sm.priceAdjustment !== undefined && sm.priceAdjustment !== 0 ? `${sm.priceAdjustment > 0 ? "+" : ""}${typeof sm.priceAdjustment === "number" ? sm.priceAdjustment.toFixed(2) : sm.priceAdjustment}` : "Included"})
                              </div>
                            ))
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No items in this order.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;

