const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart')


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'

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

router.get('/cart', authenticateToken, async (req, res) => {
    console.log('Hitted')
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
        console.log(req.user);
          // Create a new cart if none exists
          cart = new Cart({ userId: req.user.id, items: [], totalQuantity: 0 });
          await cart.save();
        }
        res.json(cart);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart' });
      }
})

router.post('/cart', authenticateToken, async (req, res) => {
    try {
        const { items, totalQuantity } = req.body;
        console.log(req.body)
        const cart = await Cart.findOneAndUpdate(
          { userId: req.user.id },
          { items: items },
          {totalQuantity: totalQuantity},
          { new: true } // Return the updated document
        );
        res.json(cart);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart' });
      }
})

router.get('/cart/delete/:productId', authenticateToken, async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router