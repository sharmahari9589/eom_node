import { addProduct, deleteProductById, getAllProducts, getProductById, updateProductById } from "../helpers/product.helper.js";
import { badRequest, created, notFound, success, unknownError } from "../helpers/response.helper.js";

// Create Product
export async function saveProduct(req, res) {
    try {
        const { status, message, data } = await addProduct(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Update Product
export async function updateProductInfo(req, res) {
    try {
        const resData = await getProductById(req.params.productId);
        if (!resData.data) {
            return notFound(res, "No data");
        }

        const { status, message, data } = await updateProductById(req.params.productId, req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get Product By ID
export async function getProductInfo(req, res) {
    try {
        const { status, message, data } = await getProductById(req.params.productId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get All Products
export async function getAllProductInfo(req, res) {
    try {
        const { status, message, data } = await getAllProducts(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Remove Product
export async function removeProduct(req, res) {
    try {
        const resData = await getProductById(req.params.productId);
        if (!resData.data) {
            return notFound(res, noProductErrorMessage);
        }

        const { status, message, data } = await deleteProductById(req.params.productId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
