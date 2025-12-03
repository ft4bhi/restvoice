const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    cuisinePreference: {
        type: String,
        default: 'None'
    },
    specialRequests: {
        type: String,
        default: 'None'
    },
    weatherInfo: {
        type: Object,
        default: {}
    },
    seatingPreference: {
        type: String,
        enum: ['indoor', 'outdoor', 'any'],
        default: 'any'
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
