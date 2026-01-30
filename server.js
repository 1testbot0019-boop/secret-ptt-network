const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const networkRoutes = require('./routes/network');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e7, // Support larger audio chunks
  cors: { origin: "*" }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', networkRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DATABASE: CONNECTED"))
  .catch(err => console.error("DATABASE: ERROR", err));

io.on('connection', (socket) => {
  socket.on('join-freq', (freq) => {
    socket.join(freq);
    console.log(`User joined: ${freq}`);
  });

  socket.on('audio-out', (data) => {
    // Send to everyone in the room except the sender
    socket.to(data.freq).emit('audio-in', data.blob);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));
