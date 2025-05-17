import { Request, Response } from "express";
import * as orderService from "../../services/orders/orderService";
import { OrderStatus } from ".prisma/client";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // TODO: Add branchId filtering based on authenticated user or query params
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for orderData (e.g., using Zod)
    // TODO: Get userId from authenticated user session
    const orderData = req.body;
    // For MVP, assuming userId is passed or mocked. In a real app, it comes from auth.
    // const userId = (req.user as any)?.id; // Example if using Passport.js or similar
    // if (!userId) {
    //   return res.status(401).json({ message: "User not authenticated" });
    // }
    // orderData.userId = userId;

    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    // TODO: Add validation for status
    if (!status || !Object.values(OrderStatus).includes(status as OrderStatus)) {
        return res.status(400).json({ message: "Invalid order status provided." });
    }
    const updatedOrder = await orderService.updateOrderStatus(req.params.id, status as OrderStatus);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found for status update" });
    }
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

