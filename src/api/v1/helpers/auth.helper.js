import { returnFormatter } from "../formatters/common.formatter.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(requestObject) {
    try {
        const { email, password } = requestObject.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return returnFormatter(false, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return returnFormatter(false, "Invalid email or password");
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return returnFormatter(true, "Login successful", {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
