import express from "express";
import { saveInvoice, getInvoice } from "../controllers/invoice.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, saveInvoice);
router.get("/:orderId", authenticateUser, getInvoice);

export default router;
