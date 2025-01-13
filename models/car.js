import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    rentalPricePerDay: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    features: [String],
    location: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
    images: String,
    createdAt: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // Adding owner field for user reference
});

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);
export default Car;
