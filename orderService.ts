import { PrismaClient, OrderStatus, PaymentStatus, OrderType } from "@prisma/client";

const prisma = new PrismaClient();

// Service to get all orders with basic filtering/pagination (future enhancement)
export const getAllOrders = async (branchId?: string) => {
  return prisma.order.findMany({
    where: {
      ...(branchId && { branchId }),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      branch: true,
      user: true, // Cashier/User who created the order
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Service to get a single order by its ID
export const getOrderById = async (orderId: string) => {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          product: true,
          selectedModifiers: {
            include: {
              modifierOption: true,
            }
          }
        },
      },
      branch: true,
      user: true,
      // Future: include customer, payments etc.
    },
  });
};

// Basic service to create an order (will be expanded later for full POS functionality)
// For MVP, this might be minimal or not fully exposed if focusing on viewing existing orders.
// However, having a basic structure helps.
export const createOrder = async (orderData: {
  branchId: string;
  userId: string; // User creating the order (e.g., cashier)
  orderType: OrderType;
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
    selectedModifiers?: Array<{
        modifierGroupId: string;
        modifierOptionId: string;
        priceAdjustment?: number; // if applicable
    }>;
  }>;
  // other fields like customerId, tableId, discountAmount, taxAmount etc. can be added
}) => {
  const { branchId, userId, orderType, totalAmount, items } = orderData;

  return prisma.order.create({
    data: {
      branch: { connect: { id: branchId } },
      user: { connect: { id: userId } },
      orderType,
      totalAmount,
      status: OrderStatus.PENDING, // Default status
      paymentStatus: PaymentStatus.UNPAID, // Default payment status
      items: {
        create: items.map(item => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          notes: item.notes,
          selectedModifiers: item.selectedModifiers ? {
            create: item.selectedModifiers.map(sm => ({
                modifierGroup: { connect: {id: sm.modifierGroupId }},
                modifierOption: { connect: {id: sm.modifierOptionId }},
                priceAdjustment: sm.priceAdjustment
            }))
          } : undefined,
        })),
      },
    },
    include: {
        items: true
    }
  });
};

// Service to update order status (e.g., PENDING -> COMPLETED, CANCELED)
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

