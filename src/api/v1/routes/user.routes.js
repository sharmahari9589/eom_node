import express from "express";
import { saveUser, updateUserInfo, getUserInfo, getAllUserInfo, removeUser } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/",  saveUser);
router.put("/:userId", authenticateUser, authorizeAdmin, updateUserInfo);
router.get("/:userId", authenticateUser, authorizeAdmin, getUserInfo);
router.get("/", authenticateUser, authorizeAdmin, getAllUserInfo);
router.delete("/:userId", authenticateUser, authorizeAdmin, removeUser);

export default router;
