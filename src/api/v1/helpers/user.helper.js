import { returnFormatter } from "../formatters/common.formatter.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export async function registerUser(requestObject) {
    try {
        const { name, email, password, phone, role, address } = requestObject.body;

        const existingUser = await userModel.findOne({ email });
        
        if (existingUser) {
            return returnFormatter(false, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || "customer",
            address
        });

        return returnFormatter(true, "User registered successfully");
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Update User By ID
export async function updateUserById(userId, requestObject) {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: requestObject.body.name,
                    email: requestObject.body.email,
                    phone: requestObject.body.phone,
                    role: requestObject.body.role,
                    address: requestObject.body.address
                }
            },
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) {
            return returnFormatter(false, "User not found");
        }

        return returnFormatter(true, "User updated successfully", updatedUser);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}


// Login User
export async function loginUser(requestObject) {
    try {
        const { email, password } = requestObject.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return returnFormatter(false, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return returnFormatter(false, "Invalid email or password");
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return returnFormatter(true, "Login successful", { token, role: user.role });
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get All Users (Admin)
export async function getAllUsers() {
    try {
        const users = await userModel.find().select("-password");
        return returnFormatter(true, "Users list", users);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get User By ID (Admin or Self)
export async function getUserById(userId) {
    try {
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return returnFormatter(false, "User not found");
        }

        return returnFormatter(true, "User details", user);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}


// Delete User (Admin)
export async function deleteUserById(userId) {
    try {
        await userModel.findByIdAndDelete(userId);
        return returnFormatter(true, "User deleted successfully");
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
