import { Request, Response } from "express";
import * as productService from "../services/menu/productService";
import { Prisma } from "@prisma/client";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    // Add Zod validation here for req.body if needed
    const product = await productService.createProduct(req.body as Prisma.ProductCreateInput);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getAllProductsHandler = async (req: Request, res: Response) => {
  try {
    // Add query param handling for filtering/sorting if needed
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

export const getProductByIdHandler = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    // Add Zod validation here for req.body if needed
    const product = await productService.updateProduct(req.params.id, req.body as Prisma.ProductUpdateInput);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

