import mongoose from "mongoose"



const stockLogSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    changeType: { type: String, enum: ['addition', 'deduction'], required: true },
    quantityChanged: { type: Number, required: true },
    reason: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('StockLog', stockLogSchema);


