import express from "express";
import { saveOrder, updateOrderInfo, getOrderInfo, getAllOrderInfo, removeOrder, getAllMyOrder } from "../controllers/order.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin, authorizeCustomer } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeCustomer, saveOrder);
router.put("/:orderId", authenticateUser, authorizeAdmin, updateOrderInfo);
router.get("/userorder", authenticateUser, getAllMyOrder);
router.get("/:orderId", authenticateUser, getOrderInfo);
router.get("/", authenticateUser, authorizeAdmin, getAllOrderInfo);
router.delete("/:orderId", authenticateUser, authorizeAdmin, removeOrder);

export default router;
