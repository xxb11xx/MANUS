import { PrismaClient, StockAdjustmentReason, InventoryItem } from "@prisma/client";

const prisma = new PrismaClient();

export const getStockLevels = async () => {
  return prisma.inventoryItem.findMany({
    include: {
      product: true,
      branch: true,
    },
  });
};

export const adjustStock = async (
  itemId: string,
  quantityChange: number, // Can be positive (increase) or negative (decrease)
  reason: StockAdjustmentReason,
  userId: string, // To log who made the adjustment
  notes?: string
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch the current inventory item
    const item = await tx.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error(`Inventory item with ID ${itemId} not found.`);
    }

    // 2. Calculate new quantity
    const newQuantity = item.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error(`Stock quantity cannot be negative for item ${item.productId}. Current: ${item.quantity}, Change: ${quantityChange}`);
    }

    // 3. Update the inventory item's quantity
    const updatedItem = await tx.inventoryItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    });

    // 4. Create a stock adjustment record for auditing
    await tx.stockAdjustment.create({
      data: {
        inventoryItemId: itemId,
        quantityChange: quantityChange,
        newQuantity: newQuantity,
        reason: reason,
        adjustedByUserId: userId,
        notes: notes,
      },
    });

    return updatedItem;
  });
};

