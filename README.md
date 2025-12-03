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

### Option 1: Running with Docker (Recommended)
This is the easiest way. It sets up the Database, Backend, and Frontend automatically.

1.  **Start the Application**
    ```bash
    sudo docker-compose up --build
    ```
    *Note: Use `sudo` if your user doesn't have Docker permissions.*

2.  **Access the App**
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

### Option 2: Running Locally (Manual with In-Memory DB)
Use this if you want to run the app quickly without installing MongoDB.
1.  **Start the Backend**
    ```bash
    # From the root directory
    npm install
    node server/index.js
    ```
    *It will automatically use an in-memory database.*

2.  **Start the Frontend**
    ```bash
    # Open a new terminal
    cd client
    npm install
    npm run dev
    ```
    Access at `http://localhost:5173`.

### Option 3: Running Locally (Manual with Real MongoDB)
If you want a persistent database but haven't installed MongoDB on your system, use Docker for just the database.

1.  **Start MongoDB Container**
    ```bash
    sudo docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```

2.  **Configure Backend**
    Create or update `server/.env` (or `.env` in root) with:
    ```env
    MONGO_URI=mongodb://localhost:27017/restvoice
    ```

3.  **Start Backend & Frontend**
    Follow the steps in Option 2. The backend will now connect to your Docker MongoDB.

## ⚠️ Troubleshooting & Best Practices

### Preventing "Zombie Containers"
To avoid containers getting stuck (permission denied errors):
1.  **Always use `docker-compose down`**: Do not just close the terminal. Run this command to stop everything cleanly.
2.  **Use `sudo` consistently**: If you start with `sudo`, you must stop with `sudo`.
3.  **Restart Docker**: If something gets stuck, run `sudo systemctl restart docker`.

### Port Conflicts
If you see `Error: listen EADDRINUSE: address already in use :::5000`:
- Check if another instance is running: `sudo lsof -i :5000`
- Kill the process: `sudo kill -9 <PID>`

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
