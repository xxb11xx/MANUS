import { PrismaClient, PrinterType, PrinterInterface } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPrinterProfiles = async (branchId?: string) => {
  return prisma.printerProfile.findMany({
    where: branchId ? { branchId } : {},
    orderBy: { name: "asc" },
    include: { branch: true },
  });
};

export const getPrinterProfileById = async (id: string) => {
  return prisma.printerProfile.findUnique({
    where: { id },
    include: { branch: true },
  });
};

export const createPrinterProfile = async (data: {
  name: string;
  branchId: string;
  type: PrinterType;
  interfaceType: PrinterInterface;
  ipAddress?: string;
  port?: number;
  isDefault?: boolean;
  paperWidth?: string; // e.g., "80mm", "58mm"
  charactersPerLine?: number;
}) => {
  return prisma.printerProfile.create({ data });
};

export const updatePrinterProfile = async (id: string, data: Partial<{
  name: string;
  branchId: string;
  type: PrinterType;
  interfaceType: PrinterInterface;
  ipAddress?: string;
  port?: number;
  isDefault?: boolean;
  paperWidth?: string;
  charactersPerLine?: number;
}>) => {
  return prisma.printerProfile.update({
    where: { id },
    data,
  });
};

export const deletePrinterProfile = async (id: string) => {
  return prisma.printerProfile.delete({ where: { id } });
};

