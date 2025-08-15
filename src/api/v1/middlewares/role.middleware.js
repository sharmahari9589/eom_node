import { returnFormatter } from "../formatters/common.formatter.js";

// Admin 
export function authorizeAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.json(returnFormatter(false, "Access denied. Admins only."));
    }
    next();
}

// Customer 
export function authorizeCustomer(req, res, next) {
    if (req.user.role !== "customer") {
        return res.json(returnFormatter(false, "Access denied. Customers only."));
    }
    next();
}
