import { Request, Response } from "express";
import * as modifierService from "../services/menu/modifierService";
import { Prisma } from "@prisma/client";

// ModifierGroup Handlers
export const createModifierGroupHandler = async (req: Request, res: Response) => {
  try {
    const group = await modifierService.createModifierGroup(req.body as Prisma.ModifierGroupCreateInput);
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating modifier group:", error);
    res.status(500).json({ error: "Failed to create modifier group" });
  }
};

export const getAllModifierGroupsHandler = async (req: Request, res: Response) => {
  try {
    const groups = await modifierService.getAllModifierGroups();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error retrieving modifier groups:", error);
    res.status(500).json({ error: "Failed to retrieve modifier groups" });
  }
};

export const getModifierGroupByIdHandler = async (req: Request, res: Response) => {
  try {
    const group = await modifierService.getModifierGroupById(req.params.id);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ error: "Modifier group not found" });
    }
  } catch (error) {
    console.error("Error retrieving modifier group:", error);
    res.status(500).json({ error: "Failed to retrieve modifier group" });
  }
};

export const updateModifierGroupHandler = async (req: Request, res: Response) => {
  try {
    const group = await modifierService.updateModifierGroup(req.params.id, req.body as Prisma.ModifierGroupUpdateInput);
    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating modifier group:", error);
    res.status(500).json({ error: "Failed to update modifier group" });
  }
};

export const deleteModifierGroupHandler = async (req: Request, res: Response) => {
  try {
    await modifierService.deleteModifierGroup(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting modifier group:", error);
    res.status(500).json({ error: "Failed to delete modifier group" });
  }
};

// ModifierOption Handlers
export const createModifierOptionHandler = async (req: Request, res: Response) => {
  try {
    const option = await modifierService.createModifierOption(req.body as Prisma.ModifierOptionCreateInput);
    res.status(201).json(option);
  } catch (error) {
    console.error("Error creating modifier option:", error);
    res.status(500).json({ error: "Failed to create modifier option" });
  }
};

export const getModifierOptionByIdHandler = async (req: Request, res: Response) => {
  try {
    const option = await modifierService.getModifierOptionById(req.params.id);
    if (option) {
      res.status(200).json(option);
    } else {
      res.status(404).json({ error: "Modifier option not found" });
    }
  } catch (error) {
    console.error("Error retrieving modifier option:", error);
    res.status(500).json({ error: "Failed to retrieve modifier option" });
  }
};

export const updateModifierOptionHandler = async (req: Request, res: Response) => {
  try {
    const option = await modifierService.updateModifierOption(req.params.id, req.body as Prisma.ModifierOptionUpdateInput);
    res.status(200).json(option);
  } catch (error) {
    console.error("Error updating modifier option:", error);
    res.status(500).json({ error: "Failed to update modifier option" });
  }
};

export const deleteModifierOptionHandler = async (req: Request, res: Response) => {
  try {
    await modifierService.deleteModifierOption(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting modifier option:", error);
    res.status(500).json({ error: "Failed to delete modifier option" });
  }
};

