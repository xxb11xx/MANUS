import { Router } from "express";
import * as orderController from "../../controllers/orders/orderController";
// import { isAuthenticated, hasRole } from "../../middlewares/authMiddleware"; // Future: Add auth middleware

const router = Router();

// Get all orders (potentially filtered by branch based on user role or query)
// router.get("/", isAuthenticated, orderController.getAllOrders);
router.get("/", orderController.getAllOrders); // Open for now, add auth later

// Get a specific order by ID
// router.get("/:id", isAuthenticated, orderController.getOrderById);
router.get("/:id", orderController.getOrderById);

// Create a new order (e.g., from POS or QR ordering)
// router.post("/", isAuthenticated, hasRole(["ADMIN", "MANAGER", "CASHIER"]), orderController.createOrder);
router.post("/", orderController.createOrder); // Open for now

// Update order status (e.g., to COMPLETED, CANCELED)
// router.put("/:id/status", isAuthenticated, hasRole(["ADMIN", "MANAGER", "CASHIER"]), orderController.updateOrderStatus);
router.put("/:id/status", orderController.updateOrderStatus); // Open for now

export default router;

