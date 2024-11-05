// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Getting new categories
router.get('/api/categories', async (req, res) => {
    console.log('Req hit')
    try{
        const categories = await Category.find({});

        res.status(201).json({data: categories});
    }catch(error){
        res.status(501).json({error: "Error Occcured "})
    }


})
// add a new category
router.post("/categories/add", async (req, res) => {

  const { name, values } = req.body;
  try {
    const category = new Category({ name, values });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
});


module.exports = router;
