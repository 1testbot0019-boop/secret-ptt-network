const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Route to check if a frequency is active
router.get('/status/:freq', async (req, res) => {
    try {
        const freq = req.params.freq;
        const room = await Room.findOne({ frequency: freq });
        
        if (room) {
            res.json({ status: "Active", message: "Frequency is currently in use." });
        } else {
            res.json({ status: "Empty", message: "This frequency is clear." });
        }
    } catch (err) {
        res.status(500).json({ error: "Network Error" });
    }
});

module.exports = router;
