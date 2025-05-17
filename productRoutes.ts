import { Router } from "express";
import {
  createProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../../controllers/menu/productController";
// import { protect, authorize } from "../../middlewares/authMiddleware"; // Will add auth middleware later

const router = Router();

router.post("/", /* protect, authorize(["Admin", "Manager"]), */ createProductHandler);
router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
router.put("/:id", /* protect, authorize(["Admin", "Manager"]), */ updateProductHandler);
router.delete("/:id", /* protect, authorize(["Admin", "Manager"]), */ deleteProductHandler);

export default router;

