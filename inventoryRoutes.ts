import { Router } from "express";
import * as inventoryController from "../../controllers/inventory/inventoryController";
// import { isAuthenticated, authorizeRoles } from "../../middleware/authMiddleware"; // Assuming auth middleware exists

const router = Router();

// Route to get stock levels
// Example with auth: router.get("/stock-levels", isAuthenticated, authorizeRoles(["Admin", "Manager"]), inventoryController.getStockLevels);
router.get("/stock-levels", inventoryController.getStockLevels);

// Route to adjust stock
// Example with auth: router.post("/stock-levels/adjust", isAuthenticated, authorizeRoles(["Admin", "Manager"]), inventoryController.adjustStock);
router.post("/stock-levels/adjust", inventoryController.adjustStock);

export default router;

