import { Router } from "express";
import {
  createModifierGroupHandler,
  getAllModifierGroupsHandler,
  getModifierGroupByIdHandler,
  updateModifierGroupHandler,
  deleteModifierGroupHandler,
  createModifierOptionHandler,
  getModifierOptionByIdHandler,
  updateModifierOptionHandler,
  deleteModifierOptionHandler,
} from "../../controllers/menu/modifierController";
// import { protect, authorize } from "../../middlewares/authMiddleware"; // Will add auth middleware later

const router = Router();

// ModifierGroup Routes
router.post("/groups", /* protect, authorize(["Admin", "Manager"]), */ createModifierGroupHandler);
router.get("/groups", getAllModifierGroupsHandler);
router.get("/groups/:id", getModifierGroupByIdHandler);
router.put("/groups/:id", /* protect, authorize(["Admin", "Manager"]), */ updateModifierGroupHandler);
router.delete("/groups/:id", /* protect, authorize(["Admin", "Manager"]), */ deleteModifierGroupHandler);

// ModifierOption Routes
router.post("/options", /* protect, authorize(["Admin", "Manager"]), */ createModifierOptionHandler);
router.get("/options/:id", getModifierOptionByIdHandler);
router.put("/options/:id", /* protect, authorize(["Admin", "Manager"]), */ updateModifierOptionHandler);
router.delete("/options/:id", /* protect, authorize(["Admin", "Manager"]), */ deleteModifierOptionHandler);

export default router;

