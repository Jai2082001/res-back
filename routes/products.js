// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const Category = require("../models/Category");
const router = express.Router();

// POST /api/products - Add a new product
router.post('/api/products', async (req, res) => {
  console.log('Req Received')
  try {
    const {
      productName,
      description,
      price,
      categoryId,
      stockQuantity,
      sku,
      ingredients,
      nutritionalInfo,
      expirationDate,
      imageUrl,
      isVegan,
      isGlutenFree
    } = req.body;
   
    const category = await Category.findById(categoryId);
    // if (!category) {
    //   return res.status(404).json({ error: "Category not found" });
    // }
    // // Validate required fields
    // if (!productName || !price || !category || !stockQuantity || !sku) {
    //   return res.status(400).json({ message: 'Missing required fields' });
    // }

    // Create a new product instance
    const newProduct = new Product({
      productName,
      description,
      price,
      category: categoryId,
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
    res.status(501).json("Error Occured")
  }

})

module.exports = router;
