const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

// Weather Route (Mock or Real)
app.get('/api/weather', async (req, res) => {
    const { date } = req.query;
    // Mock response for now
    // In a real app, use axios to call OpenWeatherMap here
    const mockWeather = {
        condition: Math.random() > 0.5 ? 'sunny' : 'rainy',
        temp: 25
    };
    res.json(mockWeather);
});

// Database Connection
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.log('No MONGO_URI found, starting in-memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
        }

        await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${mongoUri}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
