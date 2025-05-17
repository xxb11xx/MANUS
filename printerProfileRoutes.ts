import { Router } from "express";
import * as printerProfileController from "../../controllers/settings/printerProfileController";
// TODO: Add middleware for authentication and authorization

const router = Router();

router.get("/", printerProfileController.getAllPrinterProfiles);
router.post("/", printerProfileController.createPrinterProfile);
router.get("/:id", printerProfileController.getPrinterProfileById);
router.put("/:id", printerProfileController.updatePrinterProfile);
router.delete("/:id", printerProfileController.deletePrinterProfile);

export default router;

