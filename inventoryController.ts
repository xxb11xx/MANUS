import { Request, Response } from "express";
import * as inventoryService from "../../services/inventory/inventoryService";
import { StockAdjustmentReason } from "@prisma/client";

export const getStockLevels = async (req: Request, res: Response) => {
  try {
    const stockLevels = await inventoryService.getStockLevels();
    res.status(200).json(stockLevels);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching stock levels", error: error.message });
  }
};

export const adjustStock = async (req: Request, res: Response) => {
  try {
    const { itemId, quantityChange, reason, notes } = req.body;
    // Assuming userId is available from auth middleware, e.g., req.user.id
    // For MVP, if auth middleware isn't fully integrated for this route yet, we might pass a placeholder or handle it differently.
    const userId = "placeholder_user_id"; // Replace with actual user ID from auth

    if (!itemId || typeof quantityChange !== "number" || !reason) {
      return res.status(400).json({ message: "Missing required fields: itemId, quantityChange, reason" });
    }

    if (!Object.values(StockAdjustmentReason).includes(reason as StockAdjustmentReason)) {
        return res.status(400).json({ message: `Invalid reason. Must be one of: ${Object.values(StockAdjustmentReason).join(", ")}` });
    }

    const updatedItem = await inventoryService.adjustStock(itemId, quantityChange, reason as StockAdjustmentReason, userId, notes);
    res.status(200).json(updatedItem);
  } catch (error: any) {
    if (error.message.includes("not found") || error.message.includes("negative")) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Error adjusting stock", error: error.message });
    }
  }
};

