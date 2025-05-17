import { Router } from "express";
import * as branchController from "../../controllers/settings/branchController";
// TODO: Add middleware for authentication and authorization (e.g., isAdmin)

const router = Router();

router.get("/", branchController.getAllBranches);
router.post("/", branchController.createBranch);
router.get("/:id", branchController.getBranchById);
router.put("/:id", branchController.updateBranch);
router.delete("/:id", branchController.deleteBranch);

export default router;

