const express = require('express')
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb')
const bcrypt = require('bcryptjs');
const Cart = require('../models/Cart');
const Orders = require('../models/Orders');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'
    console.log(req.cookies)
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

router.post('/checkout', authenticateToken, async (req, res, next)=>{

    // cart empty 

    try{
        console.log('reached here', req.user)
        const response0 = await Cart.findOneAndDelete({userId: req.user.id});
        console.log(response0)
        const ordernew =  new Orders({userId: req.user.id, items: req.body.body, status: 'Pending'})
        const response = await ordernew.save();
        console.log(response)
        res.send({message:'done'})
    }catch(error){
        res.send({message: error})
    }
    
    
})


router.get('/my-orders', authenticateToken, async (req, res, next)=>{
    try{
        const orders =  await Orders.find({userId: req.user.id});
        res.send(orders)
    }catch{
        res.statusCode(501).send({message: 'Error'})
    }
})

router.get('/all-orders',async (req, res, next)=>{
    try{
        const orders = await Orders.find({});
        res.send(orders);
    }catch{
        res.statusCode(501).send({message: 'Error'})
    }
})


router.get('/order-action', async (req, res, next)=>{
    const status = req.headers.status;
    const id = req.headers.id
    console.log(status, id)
    try{
        Orders.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {
            status: status
        }}).then((response)=>{
            console.log(response);
            res.send(response)
        })
    }catch(err){
        console.log(err)
    }
})


module.exports = router;