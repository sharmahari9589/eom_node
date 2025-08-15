import { login } from "../helpers/auth.helper.js";
import { registerUser } from "../helpers/user.helper.js";
import { badRequest, created, success, unknownError } from "../helpers/response.helper.js";

// Register
export async function register(req, res) {
    try {
        const { status, message, data } = await registerUser(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Login
export async function loginUser(req, res) {
    try {
        const { status, message, data } = await login(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
