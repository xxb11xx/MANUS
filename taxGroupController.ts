import { Request, Response } from "express";
import * as taxGroupService from "../../services/settings/taxGroupService";

export const getAllTaxGroups = async (req: Request, res: Response) => {
  try {
    const taxGroups = await taxGroupService.getAllTaxGroups();
    res.json(taxGroups);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch tax groups", error: error.message });
  }
};

export const getTaxGroupById = async (req: Request, res: Response) => {
  try {
    const taxGroup = await taxGroupService.getTaxGroupById(req.params.id);
    if (!taxGroup) {
      return res.status(404).json({ message: "Tax group not found" });
    }
    res.json(taxGroup);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch tax group", error: error.message });
  }
};

export const createTaxGroup = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for taxGroupData (e.g., using Zod)
    const newTaxGroup = await taxGroupService.createTaxGroup(req.body);
    res.status(201).json(newTaxGroup);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "Tax group name already exists." });
    }
    res.status(500).json({ message: "Failed to create tax group", error: error.message });
  }
};

export const updateTaxGroup = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for taxGroupData
    const updatedTaxGroup = await taxGroupService.updateTaxGroup(req.params.id, req.body);
    if (!updatedTaxGroup) {
      return res.status(404).json({ message: "Tax group not found for update" });
    }
    res.json(updatedTaxGroup);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "Tax group name already exists." });
    }
    res.status(500).json({ message: "Failed to update tax group", error: error.message });
  }
};

export const deleteTaxGroup = async (req: Request, res: Response) => {
  try {
    await taxGroupService.deleteTaxGroup(req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    // Handle cases where tax group cannot be deleted due to relations (e.g., P2003 foreign key constraint)
    // For example, if tax groups are linked to products or orders directly.
    if (error.code === 'P2003') {
        return res.status(400).json({ message: "Cannot delete tax group. It is associated with other records." });
    }
    res.status(500).json({ message: "Failed to delete tax group", error: error.message });
  }
};

