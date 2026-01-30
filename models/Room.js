const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  frequency: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } 
});

module.exports = mongoose.model('Room', roomSchema);
