const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET specific booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create booking
router.post('/', async (req, res) => {
    const booking = new Booking({
        customerName: req.body.customerName,
        numberOfGuests: req.body.numberOfGuests,
        bookingDate: req.body.bookingDate,
        bookingTime: req.body.bookingTime,
        cuisinePreference: req.body.cuisinePreference,
        specialRequests: req.body.specialRequests,
        weatherInfo: req.body.weatherInfo,
        seatingPreference: req.body.seatingPreference
    });

    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        await booking.deleteOne();
        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
