import mongoose from "mongoose";

const RenterSchema = new mongoose.Schema({
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
    rentalHistory: [
        {
            car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
            rentalDate: { type: Date },
            returnDate: { type: Date },
            totalAmount: { type: Number },
        },
    ],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
}, { timestamps: true });

const Renter = mongoose.models.Renter || mongoose.model("Renter", RenterSchema);
export default Renter;
