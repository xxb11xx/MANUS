import { Router } from "express";
import * as taxGroupController from "../../controllers/settings/taxGroupController";
// TODO: Add middleware for authentication and authorization

const router = Router();

router.get("/", taxGroupController.getAllTaxGroups);
router.post("/", taxGroupController.createTaxGroup);
router.get("/:id", taxGroupController.getTaxGroupById);
router.put("/:id", taxGroupController.updateTaxGroup);
router.delete("/:id", taxGroupController.deleteTaxGroup);

export default router;

