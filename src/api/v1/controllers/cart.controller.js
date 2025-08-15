import { addToCart, getCartByUser, removeCartItem } from "../helpers/cart.helper.js";
import { badRequest, created, success, unknownError } from "../helpers/response.helper.js";

export async function saveCartItem(req, res) {
    try {
        const { status, message, data } = await addToCart(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

export async function getUserCart(req, res) {
    try {
        const { status, message, data } = await getCartByUser(req.user._id);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

export async function deleteCartItem(req, res) {
    try {
        const { status, message, data } = await removeCartItem(req.user._id, req.params.productId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
