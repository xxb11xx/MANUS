import { Request, Response } from "express";
import * as printerProfileService from "../../services/settings/printerProfileService";

export const getAllPrinterProfiles = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    const printerProfiles = await printerProfileService.getAllPrinterProfiles(branchId as string | undefined);
    res.json(printerProfiles);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch printer profiles", error: error.message });
  }
};

export const getPrinterProfileById = async (req: Request, res: Response) => {
  try {
    const printerProfile = await printerProfileService.getPrinterProfileById(req.params.id);
    if (!printerProfile) {
      return res.status(404).json({ message: "Printer profile not found" });
    }
    res.json(printerProfile);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch printer profile", error: error.message });
  }
};

export const createPrinterProfile = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for printerProfileData (e.g., using Zod)
    const newPrinterProfile = await printerProfileService.createPrinterProfile(req.body);
    res.status(201).json(newPrinterProfile);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name') && error.meta?.target?.includes('branchId')) {
        return res.status(400).json({ message: "Printer profile name already exists for this branch." });
    }
    res.status(500).json({ message: "Failed to create printer profile", error: error.message });
  }
};

export const updatePrinterProfile = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for printerProfileData
    const updatedPrinterProfile = await printerProfileService.updatePrinterProfile(req.params.id, req.body);
    if (!updatedPrinterProfile) {
      return res.status(404).json({ message: "Printer profile not found for update" });
    }
    res.json(updatedPrinterProfile);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name') && error.meta?.target?.includes('branchId')) {
        return res.status(400).json({ message: "Printer profile name already exists for this branch." });
    }
    res.status(500).json({ message: "Failed to update printer profile", error: error.message });
  }
};

export const deletePrinterProfile = async (req: Request, res: Response) => {
  try {
    await printerProfileService.deletePrinterProfile(req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    // Handle cases where printer profile cannot be deleted due to relations (e.g., P2003 foreign key constraint if linked to POSDevice)
     if (error.code === 'P2003') {
        return res.status(400).json({ message: "Cannot delete printer profile. It is associated with other records (e.g., POS Devices)." });
    }
    res.status(500).json({ message: "Failed to delete printer profile", error: error.message });
  }
};

