const express = require('express');
const isAuthenticated=require('../middlewares/product.auth.middleware')
const {
    createProduct
}=require('../controllers/product.controller')
const router=express.Router()

router.post('/create',[isAuthenticated],createProduct)

module.exports=router