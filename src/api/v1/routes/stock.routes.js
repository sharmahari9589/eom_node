import express from "express";
import { saveStockLog, updateStockLogInfo, getStockLogInfo, getAllStockLogInfo, removeStockLog } from "../controllers/stock.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, saveStockLog);
router.put("/:stockLogId", authenticateUser, authorizeAdmin, updateStockLogInfo);
router.get("/:stockLogId", authenticateUser, authorizeAdmin, getStockLogInfo);
router.get("/", authenticateUser, authorizeAdmin, getAllStockLogInfo);
router.delete("/:stockLogId", authenticateUser, authorizeAdmin, removeStockLog);

export default router;
