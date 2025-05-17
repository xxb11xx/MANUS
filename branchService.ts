import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBranches = async () => {
  return prisma.branch.findMany({ orderBy: { name: "asc" } });
};

export const getBranchById = async (id: string) => {
  return prisma.branch.findUnique({
    where: { id },
    include: { posDevices: true } // Example: include related POS devices
  });
};

export const createBranch = async (data: {
  name: string;
  nameAr?: string;
  address?: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}) => {
  return prisma.branch.create({ data });
};

export const updateBranch = async (id: string, data: Partial<{
  name: string;
  nameAr?: string;
  address?: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}>) => {
  return prisma.branch.update({
    where: { id },
    data,
  });
};

export const deleteBranch = async (id: string) => {
  // Add logic to handle related entities if necessary (e.g., reassign users/products/orders)
  // For now, a simple delete. Consider soft delete in a real application.
  return prisma.branch.delete({ where: { id } });
};

