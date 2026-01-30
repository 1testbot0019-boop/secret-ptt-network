const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import Routes
const networkRoutes = require('./routes/network');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS allowed for development
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use the network routes for API calls
app.use('/api', networkRoutes);

// Connect to MongoDB Atlas (via Render Environment Variable)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("--- STEALTH DATABASE CONNECTED ---"))
  .catch(err => console.error("DATABASE CONNECTION ERROR:", err));

// --- REAL-TIME COMMUNICATION LOGIC ---
io.on('connection', (socket) => {
  console.log('Anonymous device connected:', socket.id);

  // When a user joins a specific frequency
  socket.on('join-freq', (freq) => {
    socket.join(freq);
    console.log(`Device tuned to frequency: ${freq}`);
  });

  // When a user presses PTT and sends audio data
  socket.on('audio-out', (data) => {
    // Relays the audio blob to everyone else on the same frequency
    // data.freq: the channel name, data.blob: the raw audio chunk
    socket.to(data.freq).emit('audio-in', data.blob);
  });

  socket.on('disconnect', () => {
    console.log('Device disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`SECRET NETWORK ACTIVE ON PORT ${PORT}`);
  console.log(`====================================`);
});
