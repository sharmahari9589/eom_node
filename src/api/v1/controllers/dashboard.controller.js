import { getSalesData } from "../helpers/dashboard.helper.js";
import { badRequest, success, unknownError } from "../helpers/response.helper.js";

export async function getDashboard(req, res) {
    try {
        const { status, message, data } = await getSalesData();
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
