import { config } from "dotenv";
import { returnFormatter } from "../formatters/common.formatter.js";
import orderModel from "../models/order.model.js";
config()
// Create Order
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createOrder(req, res) {
  try {
    const { user, body } = req;

    const line_items = body.products.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.productName },
        unit_amount: item.price * 100, 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: user.email, 
      metadata: {
        userId: user._id.toString(),
        products: JSON.stringify(body.products),
        totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
        shippingAddress: JSON.stringify(body.shippingAddress),
      },
      success_url: `http://localhost:5173/cart?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart`,
    });

    return returnFormatter(true, "Stripe session created", { stripeSessionId: session.id });
  } catch (error) {
    console.error(error);
    return res.json(returnFormatter(false, error.message));
  }
}


// Get Order By ID
export async function getOrderById(orderId) {
    try {
        const order = await orderModel.findById(orderId).populate("products.product");
        if (!order) {
            return returnFormatter(false, "Order not found");
        }
        return returnFormatter(true, "Order details", order);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get All Orders (Admin)
export async function getAllOrders(requestObject) {
    try {
        const filter = {};
        if (requestObject.query.status) {
            filter.orderStatus = requestObject.query.status;
        }
        if (requestObject.query.userId) {
            filter.user = requestObject.query.userId;
        }
        const orders = await orderModel
            .find(filter)
            .populate("user", "-password")
            .populate("products.product");

        return returnFormatter(true, "All orders", orders);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get Orders By Status 
export async function getOrdersByStatus(status) {
    try {
        const orders = await orderModel
            .find({ orderStatus: status })
            .populate("user", "-password")
            .populate("products.product");

        return returnFormatter(true, `Orders with status: ${status}`, orders);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Update Order By ID
export async function updateOrderById(orderId, requestObject) {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    products: requestObject.body.products,
                    totalAmount: requestObject.body.totalAmount,
                    paymentMethod: requestObject.body.paymentMethod,
                    paymentStatus: requestObject.body.paymentStatus,
                    orderStatus: requestObject.body.orderStatus,
                    shippingAddress: requestObject.body.shippingAddress
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return returnFormatter(false, "Order not found");
        }

        return returnFormatter(true, "Order updated successfully", updatedOrder);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Delete Order
export async function deleteOrderById(orderId) {
    try {
        await orderModel.findByIdAndDelete(orderId);
        return returnFormatter(true, "Order deleted successfully");
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

// Get Orders by User 
export async function getUserOrders(requestObject) {
    try {
        
        const orders = await orderModel
            .find({ user: requestObject.user._id })
            .populate("products.product");

        return returnFormatter(true, "User orders", orders);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
