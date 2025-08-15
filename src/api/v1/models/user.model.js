import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String },
    address: [{
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
