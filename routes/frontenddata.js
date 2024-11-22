const express = require('express');
const Site_Info = require('../models/Site_Info');

const router = express.Router();

router.post('/api/update_info', async (req, res, next)=>{
    await Site_Info.deleteMany({})
    const {
        Name, 
        Logo,
        BannerImages,
        ProductDisplays
    } = req.body.updatedBody;
    const newSiteInfo = new Site_Info({Name, Logo, BannerImages, ProductDisplays});

    const savedProduct = await newSiteInfo.save();

    try{
        res.status(201).json(savedProduct)
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Server error'})
    }
})

router.use('/api/get_info', async (req, res, next)=>{
    const response = await Site_Info.find({});
    console.log(response)
    res.send(response)
})



module.exports = router 