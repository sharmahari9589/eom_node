import { returnFormatter } from "../formatters/common.formatter.js";
import cartModel from "../models/cart.model.js";

export async function addToCart(requestObject) {
    try {
        const { product, quantity } = requestObject.body;
        let cart = await cartModel.findOne({ user: requestObject.user._id });

        if (!cart) {
            cart = await cartModel.create({
                user: requestObject.user._id,
                items: [{ product, quantity }]
            });
        } else {
            const existingItem = cart.items.find(i => i.product.toString() === product);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product, quantity });
            }
            await cart.save();
        }

        return returnFormatter(true, "Item added to cart", cart);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

export async function getCartByUser(userId) {
    try {
        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        return returnFormatter(true, "Cart fetched", cart);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}


export async function removeCartItem(userId, cartItemId) {
  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return returnFormatter(false, "Cart not found");
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);

    if (cart.items.length === initialLength) {
      return returnFormatter(false, "Cart item not found");
    }

    await cart.save();

    return returnFormatter(true, "Item removed", {
      items: cart.items,
    });
  } catch (error) {
    console.error(error);
    return returnFormatter(false, error.message);
  }
}

