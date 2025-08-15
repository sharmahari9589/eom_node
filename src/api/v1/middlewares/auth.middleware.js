import jwt from "jsonwebtoken";
import { returnFormatter } from "../formatters/common.formatter.js";

export function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.json(returnFormatter(false, "Access denied. No token provided."));
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.json(returnFormatter(false, "Invalid token"));
    }
}
