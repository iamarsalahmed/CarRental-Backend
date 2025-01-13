import express from 'express';
import Booking from '../models/booking.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { carId, userId, rentalPrice, startDate, endDate, licenseId } = req.body;

        const newBooking = new Booking({
            carId,
            userId,
            rentalPrice,
            startDate,
            endDate,
            licenseId,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('carId', 'brand model');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('carId', 'brand model');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
});

export default router;
