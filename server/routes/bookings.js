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
// POST create booking
router.post('/', async (req, res) => {
    const {
        customerName, numberOfGuests, bookingDate, bookingTime,
        cuisinePreference, specialRequests, weatherInfo, seatingPreference
    } = req.body;

    try {
        // 1. Find potential tables based on Location and Capacity
        // If 'any' preference, check both. Otherwise filter by preference.
        const locationFilter = seatingPreference === 'any' ? {} : { location: seatingPreference };

        const suitableTables = await require('../models/Table').find({
            ...locationFilter,
            capacity: { $gte: numberOfGuests }
        }).sort({ capacity: 1 }); // Try to fit in smallest available table first

        if (suitableTables.length === 0) {
            return res.status(400).json({ message: `No tables available for ${numberOfGuests} guests in ${seatingPreference} area.` });
        }

        // 2. Check availability for the requested time slot
        // For simplicity, we assume a booking blocks the table for the exact date/time slot.
        // In a real app, you'd check a time range (e.g., +/- 1 hour).
        const existingBookings = await Booking.find({
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            status: 'confirmed'
        });

        const bookedTableNumbers = existingBookings.map(b => b.tableNumber);

        // 3. Find the first suitable table that is NOT in the booked list
        const availableTable = suitableTables.find(t => !bookedTableNumbers.includes(t.tableNumber));

        if (!availableTable) {
            return res.status(400).json({ message: 'All suitable tables are booked for this time slot.' });
        }

        // 4. Create the booking with the assigned table
        const booking = new Booking({
            customerName,
            numberOfGuests,
            bookingDate,
            bookingTime,
            cuisinePreference,
            specialRequests,
            weatherInfo,
            seatingPreference,
            tableNumber: availableTable.tableNumber
        });

        const newBooking = await booking.save();
        res.status(201).json({ ...newBooking.toObject(), assignedTable: availableTable });

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
