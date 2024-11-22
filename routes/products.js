// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const Category = require("../models/Category");
const router = express.Router();
const {ObjectId} = require('mongodb')

// POST /api/products - Add a new product
router.post('/api/products', async (req, res) => {
  console.log('Req Received')
  try {
    const {
      productName,
      description,
      price,
      category,
      stockQuantity,
      sku,
      ingredients,
      nutritionalInfo,
      expirationDate,
      imageUrl,
      isVegan,
      isGlutenFree
    } = req.body;
   

 
    const newProduct = new Product({
      productName,
      description,
      price,
      category: category,
      stockQuantity,
      sku,
      ingredients,
      nutritionalInfo,
      expirationDate,
      imageUrl,
      isVegan,
      isGlutenFree
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});
// Getting new product
router.get('/api/products', async (req, res) => {

  console.log('Got products')

  try {
    const allProducts = await Product.find({});
    res.status(201).json(allProducts)
  } catch (error) {
    console.log(error)
    res.status(501).json("Error Occured")
  }

})


router.get('/api/product', async (req, res) => {
  try{
    const uniqueId = req.headers.id
    const product = await Product.find({_id: new ObjectId(uniqueId)});
    res.status(201).json(product);
  }catch(error){
    console.log(error);
    res.status(501).json('Error Occured')
  }
})

module.exports = router;
