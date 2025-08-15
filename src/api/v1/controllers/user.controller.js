import { registerUser, deleteUserById, getAllUsers, getUserById, updateUserById } from "../helpers/user.helper.js";
import { badRequest, created, notFound, success, unknownError } from "../helpers/response.helper.js";

// Create User
export async function saveUser(req, res) {
    try {
        const { status, message, data } = await registerUser(req);
        return status ? created(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Update User
export async function updateUserInfo(req, res) {
    try {
        const resData = await getUserById(req.body.userId);
        if (!resData.data) {
            return notFound(res, "No data found");
        }

        const { status, message, data } = await updateUserById(req.body.userId, req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get User By ID
export async function getUserInfo(req, res) {
    try {
        const { status, message, data } = await getUserById(req.params.userId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Get All Users
export async function getAllUserInfo(req, res) {
    try {
        const { status, message, data } = await getAllUsers(req);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}

// Remove User
export async function removeUser(req, res) {
    try {
        const resData = await getUserById(req.params.userId);
        if (!resData.data) {
            return notFound(res, noUserErrorMessage);
        }

        const { status, message, data } = await deleteUserById(req.params.userId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
