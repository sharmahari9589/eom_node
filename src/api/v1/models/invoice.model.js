import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    pdfUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
