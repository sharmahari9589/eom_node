import mongoose from "mongoose"


const analyticsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    topSellingProducts: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }]
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);
