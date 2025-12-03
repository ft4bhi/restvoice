const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Table = require('./models/Table');

dotenv.config();

const tables = [
    // Indoor Tables
    { tableNumber: 1, location: 'indoor', capacity: 2 },
    { tableNumber: 2, location: 'indoor', capacity: 2 },
    { tableNumber: 3, location: 'indoor', capacity: 4 },
    { tableNumber: 4, location: 'indoor', capacity: 4 },
    { tableNumber: 5, location: 'indoor', capacity: 6 },
    { tableNumber: 6, location: 'indoor', capacity: 8 },

    // Outdoor Tables
    { tableNumber: 7, location: 'outdoor', capacity: 2 },
    { tableNumber: 8, location: 'outdoor', capacity: 4 },
    { tableNumber: 9, location: 'outdoor', capacity: 4 },
    { tableNumber: 10, location: 'outdoor', capacity: 6 }
];

const seedTables = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/restvoice';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        await Table.deleteMany({}); // Clear existing tables
        await Table.insertMany(tables);

        console.log('Tables seeded successfully!');
        console.log(tables);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding tables:', err);
        process.exit(1);
    }
};

seedTables();
