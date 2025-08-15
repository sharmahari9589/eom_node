

import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import OrderModel from "../models/order.model.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import StockLogModel from "../models/inventoryLog.model.js";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }), 
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const userId = session.metadata.userId;
        const products = JSON.parse(session.metadata.products);
        const totalAmount = session.metadata.totalAmount;
        const paymentMethod = session.metadata.paymentMethod;
        const shippingAddress = JSON.parse(session.metadata.shippingAddress);

        const existingOrder = await OrderModel.findOne({
          stripeSessionId: session.id,
        });

        if (!existingOrder) {
          const newOrder = await OrderModel.create({
            user: userId,
            products,
            totalAmount,
            paymentMethod,
            shippingAddress,
            paymentStatus: "paid",
            stripeSessionId: session.id,
          });

          console.log(" Order created:", newOrder._id);

          await CartModel.updateOne(
            { user: new mongoose.Types.ObjectId(userId) },
            {
              $pull: {
                items: {
                  product: {
                    $in: products.map(
                      (p) => new mongoose.Types.ObjectId(p.product)
                    ),
                  },
                },
              },
            }
          );
          console.log("🛒 Purchased items removed from cart");

          for (const item of products) {
            const productId = new mongoose.Types.ObjectId(item.product);
            const quantityPurchased = item.quantity;

            const productDoc = await ProductModel.findById(productId);
            if (!productDoc) {
              console.warn(`Product not found: ${productId}`);
              continue;
            }

            const oldStock = productDoc.stock;
            productDoc.stock = oldStock - quantityPurchased;
            await productDoc.save();

            console.log(
              `Stock updated for ${productDoc.name}: -${quantityPurchased}, New Stock: ${productDoc.stock}`
            );

            await StockLogModel.create({
              product: productId,
              changeType: "deduction",
              quantityChanged: quantityPurchased,
              reason: "Customer Purchase via Stripe Checkout",
              updatedBy: userId, 
            });
          }
        } else {
          console.log(" Order already exists for session:", session.id);
        }
      } catch (err) {
        console.error(" Failed to create order or update stock:", err);
        return res.status(500).send("Internal Server Error");
      }
    } else {
      console.log(` Unhandled event type ${event.type}`);
    }

    res.status(200).send();
  }
);

export default router;
