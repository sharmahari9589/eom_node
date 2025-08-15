import { returnFormatter } from "../formatters/common.formatter.js";
import productModel from "../models/product.model.js";
import path from "path";
import { updateProductStock } from "./stock.helper.js";

// Add Product
export async function addProduct(requestObject) {
    try {
        let imagePath = null;
        if (requestObject.file) {
            imagePath = path.join("/image", requestObject.file.filename);
        }

        const product = await productModel.create({
            name: requestObject.body.name,
            description: requestObject.body.description,
            category: requestObject.body.category,
            price: requestObject.body.price,
            stock: 0, 
            images: imagePath,
            brand: requestObject.body.brand
        });

        if (requestObject.body.stock && requestObject.body.stock > 0) {
            await updateProductStock(product._id, requestObject.body.stock, "Initial stock added", requestObject.user._id);
        }

        return returnFormatter(true, "Product created successfully", product);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Update Product By ID
export async function updateProductById(productId, requestObject) {
    try {
        let imagePath = null;
        if (requestObject.file) {
            imagePath = path.join("/image", requestObject.file.filename);
        }

        const product = await productModel.findById(productId);
        if (!product) return returnFormatter(false, "Product not found");

        const newStock = requestObject.body.stock;
        if (newStock !== undefined && newStock !== product.stock) {
            const quantityChange = newStock - product.stock; 
            await updateProductStock(productId, quantityChange, "Stock updated via product update", requestObject.user._id);
        }

        const updateData = {
            name: requestObject.body.name,
            description: requestObject.body.description,
            category: requestObject.body.category,
            price: requestObject.body.price,
            brand: requestObject.body.brand
        };
        if (imagePath) updateData.images = imagePath;

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return returnFormatter(true, "Product updated successfully", updatedProduct);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Delete Product by ID
export async function deleteProductById(productId) {
    try {
        await productModel.findByIdAndDelete(productId);
        return returnFormatter(true, "Product removed successfully");
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get Product List with Filters
export async function getAllProducts(requestObject) {
    try {
        const filter = {};
        if (requestObject.query.category) filter.category = requestObject.query.category;
        if (requestObject.query.search) filter.name = new RegExp(requestObject.query.search, 'i');

        const products = await productModel.find(filter);
        return returnFormatter(true, "Product list", products);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}


// Get Product By ID
export async function getProductById(productId) {
    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return returnFormatter(false, "Product not found");
        }

        return returnFormatter(true, "Product details", product);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
