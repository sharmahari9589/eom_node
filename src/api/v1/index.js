import { Router } from "express";
// Auth
import authRouter from "./routes//auth.route.js";
// User
import userRouter from "./routes/user.routes.js";
// Product
import productRouter from "./routes/product.routes.js";
// Order
import orderRouter from "./routes/order.routes.js";
// Stock
import stockRouter from "./routes/stock.routes.js";
// Cart
import cartRouter from "./routes/cart.routes.js";
// Invoice
import invoiceRouter from "./routes/invoice.routes.js";
// Dashboard
import dashboardRouter from "./routes/dashboard.routes.js";

const router = Router();

// Public routes
router.use("/auth", authRouter);

// Protected routes
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/stocks", stockRouter);
router.use("/cart", cartRouter);
router.use("/invoices", invoiceRouter);
router.use("/dashboard", dashboardRouter);

export default router;

