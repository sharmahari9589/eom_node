import { returnFormatter } from "../formatters/common.formatter.js";
import invoiceModel from "../models/invoice.model.js";

export async function createInvoice(requestObject) {
    try {
        const invoice = await invoiceModel.create({
            order: requestObject.body.order,
            invoiceNumber: "INV-" + Date.now(),
            totalAmount: requestObject.body.totalAmount,
            pdfUrl: requestObject.body.pdfUrl || ""
        });
        return returnFormatter(true, "Invoice created", invoice);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}

export async function getInvoiceByOrder(orderId) {
    try {
        const invoice = await invoiceModel.findOne({ order: orderId }).populate("order");
        return returnFormatter(true, "Invoice fetched", invoice);
    } catch (error) {
        return returnFormatter(false, error.message);
    }
}
