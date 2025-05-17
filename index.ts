import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/menu/categoryRoutes";
import productRoutes from "./routes/menu/productRoutes";
import modifierRoutes from "./routes/menu/modifierRoutes";
import orderRoutes from "./routes/orders/orderRoutes";
import branchRoutes from "./routes/settings/branchRoutes"; 
import taxGroupRoutes from "./routes/settings/taxGroupRoutes";
import posDeviceRoutes from "./routes/settings/posDeviceRoutes";
import printerProfileRoutes from "./routes/settings/printerProfileRoutes";
import inventoryRoutes from "./routes/inventory/inventoryRoutes"; // Import inventory routes

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("XB Dashboard Backend API");
});

// Mount Auth Routes
app.use("/api/v1/auth", authRoutes);

// Mount Menu Routes
app.use("/api/v1/menu/categories", categoryRoutes);
app.use("/api/v1/menu/products", productRoutes);
app.use("/api/v1/menu/modifiers", modifierRoutes);

// Mount Order Routes
app.use("/api/v1/orders", orderRoutes);

// Mount Settings Routes
app.use("/api/v1/settings/branches", branchRoutes);
app.use("/api/v1/settings/tax-groups", taxGroupRoutes);
app.use("/api/v1/settings/pos-devices", posDeviceRoutes);
app.use("/api/v1/settings/printer-profiles", printerProfileRoutes);

// Mount Inventory Routes
app.use("/api/v1/inventory", inventoryRoutes); // Mount inventory routes

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

