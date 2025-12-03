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

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Restaurant Booking Voice Agent API is running!',
        endpoints: {
            bookings: '/api/bookings',
            weather: '/api/weather'
        }
    });
});

// Routes
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

// Weather Route (Mock or Real)
// In a production environment, this would call an external API like OpenWeatherMap
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
// Connects to MongoDB Atlas if URI provided, otherwise falls back to in-memory database for local testing
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
        console.error('MongoDB connection error:', err.message);
        console.log('Falling back to in-memory MongoDB...');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        await mongoose.connect(memoryUri);
        console.log(`MongoDB Connected (In-Memory): ${memoryUri}`);
    }
};

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Graceful Shutdown Logic
    const shutdown = async () => {
        console.log('Shutting down server...');
        server.close(async () => {
            console.log('HTTP server closed.');
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed.');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
});
