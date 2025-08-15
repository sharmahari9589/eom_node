import { createOrder, deleteOrderById, getAllOrders, getOrderById, getUserOrders, updateOrderById } from "../helpers/order.helper.js";
import { badRequest, created, notFound, success, unknownError } from "../helpers/response.helper.js";

// Create Order
export async function saveOrder(req, res) {
    try {
        const { status, message, data } = await createOrder(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Update Order
export async function updateOrderInfo(req, res) {
    try {
        const resData = await getOrderById(req.params.orderId);
        if (!resData.data) {
            return notFound(res, "No data found");
        }

        const { status, message, data } = await updateOrderById(req.params.orderId, req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get Order By ID
export async function getOrderInfo(req, res) {
    try {
        
        const { status, message, data } = await getOrderById(req.params.orderId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get All Orders
export async function getAllOrderInfo(req, res) {
    try {
        const { status, message, data } = await getAllOrders(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// get user order
export async function getAllMyOrder(req, res) {
    try {
        const { status, message, data } = await getUserOrders(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}


// Remove Order
export async function removeOrder(req, res) {
    try {
        const resData = await getOrderById(req.params.orderId);
        if (!resData.data) {
            return notFound(res, noOrderErrorMessage);
        }

        const { status, message, data } = await deleteOrderById(req.params.orderId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
