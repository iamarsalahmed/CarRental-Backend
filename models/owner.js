import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
    carsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    earnings: { type: Number, default: 0 },
}, { timestamps: true });

const Owner = mongoose.models.Owner || mongoose.model("Owner", OwnerSchema);
export default Owner;
