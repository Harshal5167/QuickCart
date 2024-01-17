const express=require('express')
const router=express.Router()
const {
    getProfile
}=require('../controllers/customer.controller')
const isAuthenticated=require('../../middleware/auth.middleware')

router.get('/profile',[isAuthenticated],getProfile)

module.exports=router