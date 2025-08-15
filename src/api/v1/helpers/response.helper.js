// Send success response --------------------------------------------------------
async function success(res, message, items) {
    sendResponse(res, 200, true, message, "", items);
}

// Send created response --------------------------------------------------------
async function created(res, message, items) {
    sendResponse(res, 201, true, message, "", items);
}

// Send not found response ------------------------------------------------------
async function notFound(res, message) {
    sendResponse(res, 404, false, message, "", {});
}

// Send bad request response ----------------------------------------------------
async function badRequest(res, message, error = "") {
    sendResponse(res, 400, false, message, error, undefined);
}

// Send unauthorized response ---------------------------------------------------
async function unauthorized(res, message) {
    sendResponse(res, 401, false, message, "", {});
}

// Send forbidden response ------------------------------------------------------
async function forbidden(res, message) {
    sendResponse(res, 403, false, message, "", {});
}

// Send validation error response -----------------------------------------------
async function serverValidation(res, error) {
    let responseErrors = {};

    // express-validator errors (array format)
    if (Array.isArray(error.errors)) {
        error.errors.forEach(err => {
            const key = err.param.toUpperCase().replace(/\./g, "-");
            const value = err.msg.toUpperCase().replace(/\./g, "-");
            responseErrors[key] = value;
        });
    }
    // Mongoose validation errors (object format)
    else if (error.errors && typeof error.errors === "object") {
        Object.keys(error.errors).forEach(field => {
            responseErrors[field.toUpperCase().replace(/\./g, "-")] =
                error.errors[field].message.toUpperCase().replace(/\./g, "-");
        });
    }

    sendResponse(res, 400, false, "Server Validation Errors", "ValidationError", responseErrors);
}

// Handle unknown errors --------------------------------------------------------
async function unknownError(res, error) {
    if (error && error.name === "ValidationError") {
        const errormessage = await validation(error.message);
        sendResponse(res, 400, false, "All Fields Required", "ValidationError", errormessage);
    } 
    else if (error && error.name === "CastError") {
        sendResponse(res, 400, false, "Invalid Data", "CastError", {
            data: `Need ${error.kind} but got ${error.valueType}`
        });
    } 
    else if (error && error.name === "MongoError" && error.code === 11000) {
        const errormessage = await alreadyExist(error.keyValue);
        sendResponse(res, 400, false, "Unique Data Required", "UniqueDataRequired", errormessage);
    } 
    else {
        console.error(error);
        sendResponse(res, 500, false, "Something Went Wrong", error?.message || "", {});
    }
}

//===================================================================================================
async function validation(e) {
    const errors = {};
    const allErrors = e.substring(e.indexOf(":") + 1).trim();
    const errorArray = allErrors.split(",").map(err => err.trim());
    errorArray.forEach(error => {
        const [key, value] = error.split(":").map(err => err.trim());
        errors[key.toUpperCase().replace(/\./g, "-")] = value.toUpperCase().replace(/\./g, "-");
    });
    return errors;
}

async function alreadyExist(e) {
    const errors = {};
    Object.keys(e).forEach(key => {
        errors[key.toUpperCase().replace(/\./g, "-")] =
            `${key.toUpperCase().replace(/\./g, "-")} ALREADY EXIST`;
    });
    return errors;
}
//====================================================================================================

async function onError(res, message, error) {
    sendResponse(res, 400, false, message, error, null);
}

async function sendResponse(res, statusCode, status, message, error, items) {
    let response = {
        status,
        subCode: statusCode,
        message,
        error,
        items
    };
    res.status(statusCode).json(response);
}

async function invalid(res, message, items) {
    sendResponse(res, 301, false, message, "", items);
}
//====================================================================================================

export {
    success,
    created,
    notFound,
    badRequest,
    unauthorized,
    forbidden,
    serverValidation,
    unknownError,
    validation,
    alreadyExist,
    sendResponse,
    invalid,
    onError
};
