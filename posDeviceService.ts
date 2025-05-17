import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPOSDevices = async (branchId?: string) => {
  return prisma.pOSDevice.findMany({
    where: branchId ? { branchId } : {},
    orderBy: { name: "asc" },
    include: { branch: true, printerProfile: true },
  });
};

export const getPOSDeviceById = async (id: string) => {
  return prisma.pOSDevice.findUnique({
    where: { id },
    include: { branch: true, printerProfile: true },
  });
};

export const createPOSDevice = async (data: {
  name: string;
  branchId: string;
  deviceKey?: string; // Will be auto-generated if not provided
  isActive?: boolean;
  appVersion?: string;
  printerProfileId?: string;
}) => {
  return prisma.pOSDevice.create({ data });
};

export const updatePOSDevice = async (id: string, data: Partial<{
  name: string;
  branchId: string;
  isActive?: boolean;
  appVersion?: string;
  printerProfileId?: string;
}>) => {
  return prisma.pOSDevice.update({
    where: { id },
    data,
  });
};

export const deletePOSDevice = async (id: string) => {
  return prisma.pOSDevice.delete({ where: { id } });
};

