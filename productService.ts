import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({ data });
};

export const getAllProducts = async (filter: any = {}, orderBy: any = { createdAt: "desc" }) => {
  return prisma.product.findMany({
    where: filter,
    orderBy,
    include: { category: true, branch: true, modifiers: { include: { options: true } } },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, branch: true, modifiers: { include: { options: true } } },
  });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true, branch: true, modifiers: { include: { options: true } } },
  });
};

export const deleteProduct = async (id: string) => {
  // Consider soft delete or cascading deletes for related entities like OrderItems if necessary
  return prisma.product.delete({ where: { id } });
};

