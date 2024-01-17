const express = require('express');
const isAuthenticated=require('../../middleware/auth.middleware')
const {
    createProduct,
    getProducts,
    rateProduct
}=require('../controllers/product.controller')
const router=express.Router()

router.post('/create',[isAuthenticated],createProduct)
router.get('/',[isAuthenticated],getProducts)
router.post('/rate/:id',[isAuthenticated],rateProduct)

module.exports=router