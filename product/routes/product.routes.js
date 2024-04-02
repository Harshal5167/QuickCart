const express = require('express');
const isAuthenticated = require('../../middleware/auth.middleware')
const upload = require('../../middleware/multer.middleware')
const {
    sellProduct,
    getProducts,
    rateProduct,
    getProductsByCategory,
    getProductsByUserUsingIds
} = require('../controllers/product.controller')
const router = express.Router()

router.post('/sell', [isAuthenticated, upload.single('image')], sellProduct)
router.get('/', [isAuthenticated], getProducts)
router.post('/rate/:id', [isAuthenticated], rateProduct)
router.get('/listedByUser', [isAuthenticated], getProductsByUserUsingIds)
router.get('/:category', [isAuthenticated], getProductsByCategory)

module.exports = router