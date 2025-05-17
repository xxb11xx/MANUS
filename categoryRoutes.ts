import { Router } from "express";
import {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../../controllers/menu/categoryController";
// import { protect, authorize } from "../../middlewares/authMiddleware"; // Will add auth middleware later

const router = Router();

router.post("/", /* protect, authorize(["Admin", "Manager"]), */ createCategoryHandler);
router.get("/", getAllCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);
router.put("/:id", /* protect, authorize(["Admin", "Manager"]), */ updateCategoryHandler);
router.delete("/:id", /* protect, authorize(["Admin", "Manager"]), */ deleteCategoryHandler);

export default router;

