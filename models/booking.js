import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rentalPrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    licenseId: { type: String, required: true },
    status: { type: String, default: 'Pending' }, // Can be 'Pending', 'Confirmed', or 'Canceled'
    createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;
