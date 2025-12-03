# Restaurant Booking Voice Agent

A MERN stack voice-enabled AI agent for booking restaurant tables.

## Features
- 🎙️ **Voice Interaction**: Speak to the agent to book a table.
- 🌤️ **Weather Integration**: Suggests indoor/outdoor seating based on weather.
- 📝 **Booking Management**: Create, view, and cancel bookings.
- 💾 **Database**: Stores bookings in MongoDB.

## Tech Stack
- **Frontend**: React, Vite, Web Speech API
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (or In-Memory fallback)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Optional, defaults to in-memory)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restvoice
   ```

2. **Install Dependencies**
   ```bash
   # Install backend deps
   npm install

   # Install frontend deps
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/restvoice
   # If MONGO_URI is omitted, it will use an in-memory database.
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   node server/index.js
   ```
   Server runs on `http://localhost:5000`.

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`.

## Usage
1. Open the frontend URL.
2. Click "Start Conversation" or the Microphone icon.
3. Say "I want to book a table".
4. Follow the voice prompts to provide details (Guests, Date, Time, Cuisine).
5. Confirm the booking.

## API Endpoints
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a booking
- `DELETE /api/bookings/:id` - Cancel a booking
- `GET /api/weather?date=...` - Get weather forecast
