import { Request, Response } from "express";
import * as branchService from "../../services/settings/branchService";

export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const branches = await branchService.getAllBranches();
    res.json(branches);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch branches", error: error.message });
  }
};

export const getBranchById = async (req: Request, res: Response) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json(branch);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch branch", error: error.message });
  }
};

export const createBranch = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for branchData (e.g., using Zod)
    const newBranch = await branchService.createBranch(req.body);
    res.status(201).json(newBranch);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "Branch name already exists." });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ message: "Branch email already exists." });
    }
    res.status(500).json({ message: "Failed to create branch", error: error.message });
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for branchData
    const updatedBranch = await branchService.updateBranch(req.params.id, req.body);
    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found for update" });
    }
    res.json(updatedBranch);
  } catch (error: any) {
     if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "Branch name already exists." });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ message: "Branch email already exists." });
    }
    res.status(500).json({ message: "Failed to update branch", error: error.message });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    // Handle cases where branch cannot be deleted due to relations if not handled by Prisma (e.g., P2003 foreign key constraint)
    if (error.code === 'P2003') {
        return res.status(400).json({ message: "Cannot delete branch. It is associated with other records (e.g., users, products, orders)." });
    }
    res.status(500).json({ message: "Failed to delete branch", error: error.message });
  }
};

