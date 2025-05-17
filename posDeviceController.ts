import { Request, Response } from "express";
import * as posDeviceService from "../../services/settings/posDeviceService";

export const getAllPOSDevices = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    const posDevices = await posDeviceService.getAllPOSDevices(branchId as string | undefined);
    res.json(posDevices);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch POS devices", error: error.message });
  }
};

export const getPOSDeviceById = async (req: Request, res: Response) => {
  try {
    const posDevice = await posDeviceService.getPOSDeviceById(req.params.id);
    if (!posDevice) {
      return res.status(404).json({ message: "POS device not found" });
    }
    res.json(posDevice);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch POS device", error: error.message });
  }
};

export const createPOSDevice = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for posDeviceData (e.g., using Zod)
    const newPOSDevice = await posDeviceService.createPOSDevice(req.body);
    res.status(201).json(newPOSDevice);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "POS device name already exists." });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('deviceKey')) {
        return res.status(400).json({ message: "POS device key already exists (should be auto-generated or unique)." });
    }
    res.status(500).json({ message: "Failed to create POS device", error: error.message });
  }
};

export const updatePOSDevice = async (req: Request, res: Response) => {
  try {
    // TODO: Add validation for posDeviceData
    const updatedPOSDevice = await posDeviceService.updatePOSDevice(req.params.id, req.body);
    if (!updatedPOSDevice) {
      return res.status(404).json({ message: "POS device not found for update" });
    }
    res.json(updatedPOSDevice);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(400).json({ message: "POS device name already exists." });
    }
    res.status(500).json({ message: "Failed to update POS device", error: error.message });
  }
};

export const deletePOSDevice = async (req: Request, res: Response) => {
  try {
    await posDeviceService.deletePOSDevice(req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    // Handle cases where POS device cannot be deleted due to relations (e.g., P2003 foreign key constraint)
    res.status(500).json({ message: "Failed to delete POS device", error: error.message });
  }
};

