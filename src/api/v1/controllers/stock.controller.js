import { addStockLog, deleteStockLogById, getAllStockLogs, getStockLogById, updateStockLogById } from "../helpers/stock.helper.js";
import { badRequest, created, notFound, success, unknownError } from "../helpers/response.helper.js";

// Create Stock Log
export async function saveStockLog(req, res) {
    try {
        const { status, message, data } = await addStockLog(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Update Stock Log
export async function updateStockLogInfo(req, res) {
    try {
        const resData = await getStockLogById(req.params.stockLogId);
        if (!resData.data) {
            return notFound(res, "No data found");
        }

        const { status, message, data } = await updateStockLogById(req.params.stockLogId, req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get Stock Log By ID
export async function getStockLogInfo(req, res) {
    try {
        const { status, message, data } = await getStockLogById(req.params.stockLogId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get All Stock Logs
export async function getAllStockLogInfo(req, res) {
    try {
        const { status, message, data } = await getAllStockLogs(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Remove Stock Log
export async function removeStockLog(req, res) {
    try {
        const resData = await getStockLogById(req.params.stockLogId);
        if (!resData.data) {
            return notFound(res, noStockLogErrorMessage);
        }

        const { status, message, data } = await deleteStockLogById(req.params.stockLogId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
