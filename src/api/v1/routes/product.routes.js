import express from "express";
import {
    saveProduct,
    updateProductInfo,
    getProductInfo,
    getAllProductInfo,
    removeProduct
} from "../controllers/product.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import uploads from "../middlewares/multer.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, uploads.single("image"), saveProduct);

router.put("/:productId", authenticateUser, authorizeAdmin,uploads.single("image"), updateProductInfo);
router.get("/:productId", getProductInfo);
router.get("/", getAllProductInfo);
router.delete("/:productId", authenticateUser, authorizeAdmin, removeProduct);

export default router;
