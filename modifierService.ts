import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// ModifierGroup CRUD
export const createModifierGroup = async (data: Prisma.ModifierGroupCreateInput) => {
  return prisma.modifierGroup.create({ data });
};

export const getAllModifierGroups = async () => {
  return prisma.modifierGroup.findMany({ include: { options: true } });
};

export const getModifierGroupById = async (id: string) => {
  return prisma.modifierGroup.findUnique({ where: { id }, include: { options: true } });
};

export const updateModifierGroup = async (id: string, data: Prisma.ModifierGroupUpdateInput) => {
  return prisma.modifierGroup.update({ where: { id }, data, include: { options: true } });
};

export const deleteModifierGroup = async (id: string) => {
  // Consider implications: deleting a group might require disassociation from products or deleting options
  return prisma.modifierGroup.delete({ where: { id } });
};

// ModifierOption CRUD
export const createModifierOption = async (data: Prisma.ModifierOptionCreateInput) => {
  return prisma.modifierOption.create({ data });
};

export const getModifierOptionById = async (id: string) => {
  return prisma.modifierOption.findUnique({ where: { id } });
};

export const updateModifierOption = async (id: string, data: Prisma.ModifierOptionUpdateInput) => {
  return prisma.modifierOption.update({ where: { id }, data });
};

export const deleteModifierOption = async (id: string) => {
  return prisma.modifierOption.delete({ where: { id } });
};

