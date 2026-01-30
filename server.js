const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Stealth Network Online"))
  .catch(err => console.error("Network Error:", err));

io.on('connection', (socket) => {
  socket.on('join-freq', (freq) => {
    socket.join(freq);
    console.log(`User tuned to: ${freq}`);
  });

  socket.on('audio-out', (data) => {
    // Broadcasts audio to everyone on the same frequency
    socket.to(data.freq).emit('audio-in', data.blob);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));