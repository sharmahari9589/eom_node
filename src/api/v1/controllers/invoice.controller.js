import { createInvoice, getInvoiceByOrder } from "../helpers/invoice.helper.js";
import { badRequest, created, success, unknownError } from "../helpers/response.helper.js";

export async function saveInvoice(req, res) {
    try {
        const { status, message, data } = await createInvoice(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

export async function getInvoice(req, res) {
    try {
        const { status, message, data } = await getInvoiceByOrder(req.params.orderId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
