import express from "express";
import { saveCartItem, getUserCart, deleteCartItem } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeCustomer } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeCustomer, saveCartItem);
router.get("/", authenticateUser, authorizeCustomer, getUserCart);
router.delete("/:productId", authenticateUser, authorizeCustomer, deleteCartItem);

export default router;
