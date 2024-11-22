const express = require('express');
const router = express.Router();
const Address = require('../models/Addresses');
const jwt = require('jsonwebtoken');




const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'
   console.C
    if (!token) {
        return res.sendStatus(401); // Unauthorized if no token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware
    });
};

router.post('/api/addresses', authenticateToken, async (req, res) => {
    let userId = req.user.id; 
    const {  firstName, lastName, streetAddress, townCity, district, phone, zipCode, email, isDefault } = req.body;

    // Validate request data
    if (!userId || !firstName || !lastName || !streetAddress || !townCity || !district || !phone || !zipCode || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newAddress = new Address({
            userId,
            firstName,
            lastName,
            streetAddress,
            townCity,
            district,
            phone,
            zipCode,
            email,
            isDefault: isDefault || false, // Use provided isDefault or default to false
        });

        const savedAddress = await newAddress.save();
        return res.status(201).json(savedAddress); // Return the created address
    } catch (error) {
        console.error('Error saving address:', error);
        return res.status(500).json({ error: 'Failed to save address' });
    }
});

router.get('/api/addresses', authenticateToken, async (req, res) => {
    
    const userId  = req.user.id;
    try {
        const addresses = await Address.find({ userId });
        if (!addresses || addresses.length === 0) {
            return res.json([]);
        }
        return res.status(200).json(addresses);
    } catch (error) {
        console.error('Error retrieving addresses:', error);
        return res.status(500).json({ error: 'Failed to retrieve addresses' });
    }
})

module.exports = router