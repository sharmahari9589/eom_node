import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeAdmin, getDashboard);

export default router;
