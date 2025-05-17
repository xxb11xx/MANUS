import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTaxGroups = async () => {
  return prisma.taxGroup.findMany({ orderBy: { name: "asc" } });
};

export const getTaxGroupById = async (id: string) => {
  return prisma.taxGroup.findUnique({ where: { id } });
};

export const createTaxGroup = async (data: {
  name: string;
  nameAr?: string;
  rate: number;
  isDefault?: boolean;
  zatcaCompliant?: boolean;
  taxNumber?: string;
  taxInvoiceTitle?: string;
  taxInvoiceTitleAr?: string;
}) => {
  return prisma.taxGroup.create({ data });
};

export const updateTaxGroup = async (id: string, data: Partial<{
  name: string;
  nameAr?: string;
  rate: number;
  isDefault?: boolean;
  zatcaCompliant?: boolean;
  taxNumber?: string;
  taxInvoiceTitle?: string;
  taxInvoiceTitleAr?: string;
}>) => {
  return prisma.taxGroup.update({
    where: { id },
    data,
  });
};

export const deleteTaxGroup = async (id: string) => {
  // Consider implications if a tax group is in use before deleting
  return prisma.taxGroup.delete({ where: { id } });
};

