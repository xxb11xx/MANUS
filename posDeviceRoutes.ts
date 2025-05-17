import { Router } from "express";
import * as posDeviceController from "../../controllers/settings/posDeviceController";
// TODO: Add middleware for authentication and authorization

const router = Router();

router.get("/", posDeviceController.getAllPOSDevices);
router.post("/", posDeviceController.createPOSDevice);
router.get("/:id", posDeviceController.getPOSDeviceById);
router.put("/:id", posDeviceController.updatePOSDevice);
router.delete("/:id", posDeviceController.deletePOSDevice);

export default router;

