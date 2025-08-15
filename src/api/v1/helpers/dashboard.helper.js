import { returnFormatter } from "../formatters/common.formatter.js";
import orderModel from "../models/order.model.js";

export async function getSalesData() {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Total Sales Today
        const salesTodayAgg = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalSalesToday = salesTodayAgg[0]?.total || 0;

        // 2. Orders This Month
        const ordersThisMonth = await orderModel.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // 3. Total Revenue
        const totalRevenueAgg = await orderModel.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        // 4. Sales Overview (monthly sales for current year)
        const salesOverview = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(today.getFullYear(), 0, 1),
                        $lte: today
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesOverviewFormatted = salesOverview.map(s => ({
            month: monthNames[s._id.month - 1],
            total: s.total
        }));

        // 5. Revenue by Payment Method
        const revenueByPayment = await orderModel.aggregate([
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const paymentMethods = revenueByPayment.map(p => ({
            method: p._id,
            total: p.total
        }));

        return returnFormatter(true, "Dashboard data", {
            totalSalesToday,
            ordersThisMonth,
            totalRevenue,
            salesOverview: salesOverviewFormatted,
            revenueByPayment: paymentMethods
        });

    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
