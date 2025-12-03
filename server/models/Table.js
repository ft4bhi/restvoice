const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    location: {
        type: String,
        enum: ['indoor', 'outdoor'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Table', TableSchema);
