import { returnFormatter } from "../formatters/common.formatter.js";
import stockLogModel from "../models/inventoryLog.model.js";
import Product from "../models/product.model.js";
// Add Stock Log
export async function addStockLog(requestObject) {
    try {
        const { product, changeType, quantityChanged, reason } = requestObject.body;
        const quantity = changeType === "addition" ? quantityChanged : -quantityChanged;

        return await updateProductStock(product, quantity, reason, requestObject.user._id);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get Stock Log By ID
export async function getStockLogById(stockLogId) {
    try {
        const stockLog = await stockLogModel
            .findById(stockLogId)
            .populate("product")
            .populate("updatedBy", "-password");

        if (!stockLog) {
            return returnFormatter(false, "Stock log not found");
        }

        return returnFormatter(true, "Stock log details", stockLog);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get All Stock Logs (Admin)
export async function getAllStockLogs(requestObject) {
    try {
        const filter = {};
        if (requestObject.query.productId) {
            filter.product = requestObject.query.productId;
        }
        if (requestObject.query.changeType) {
            filter.changeType = requestObject.query.changeType;
        }

        const logs = await stockLogModel
            .find(filter)
            .populate("product")
            .populate("updatedBy", "-password");

        return returnFormatter(true, "All stock logs", logs);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Update Stock Log By ID


export async function updateStockLogById(stockLogId, requestObject) {
    try {
        const { product, changeType, quantityChanged, reason } = requestObject.body;

        if (!["addition", "deduction"].includes(changeType)) {
            throw new Error("Invalid changeType, must be 'addition' or 'deduction'");
        }

        const productDoc = await Product.findById(product);
        if (!productDoc) throw new Error("Product not found");

        if (changeType === "addition") {
            productDoc.stock += quantityChanged;
        } else {
            productDoc.stock -= quantityChanged;
        }

        if (productDoc.stock < 0) throw new Error("Stock cannot be negative");

        await productDoc.save();

        const existingLog = await stockLogModel.findById(stockLogId);
        if (!existingLog) throw new Error("Stock log not found");

        existingLog.product = product;
        existingLog.changeType = changeType;
        existingLog.quantityChanged = quantityChanged;
        existingLog.reason = reason;
        await existingLog.save();

        return returnFormatter(true, "Stock updated successfully", existingLog);
    } catch (error) {
        console.log(error);
        return returnFormatter(false, error.message);
    }
}

// Delete Stock Log
export async function deleteStockLogById(stockLogId) {
    try {
        await stockLogModel.findByIdAndDelete(stockLogId);
        return returnFormatter(true, "Stock log deleted successfully");
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get Stock Logs for Product
export async function getStockLogsByProduct(productId) {
    try {
        const logs = await stockLogModel.find({ product: productId }).populate("product");
        return returnFormatter(true, "Stock logs", logs);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}


// central stock update
export async function updateProductStock(productId, quantityChange, reason, userId) {
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");

        const newStock = product.stock + quantityChange;
        if (newStock < 0) throw new Error("Stock cannot be negative");

        product.stock = newStock;
        await product.save();

        const stockLog = await stockLogModel.create({
            product: productId,
            changeType: quantityChange > 0 ? "addition" : "deduction",
            quantityChanged: Math.abs(quantityChange),
            reason,
            updatedBy: userId
        });

        return returnFormatter(true, "Stock updated successfully", stockLog);
    } catch (err) {
        console.log(err);
        return returnFormatter(false, err.message);
    }
}