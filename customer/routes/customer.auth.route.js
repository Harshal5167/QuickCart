const express = require('express');
const router=express.Router()
const {
    login,
    logout,
    signup
}=require('../controllers/customer.auth.controller')
// const isAuthenticated=require('../../Middlewares/auth.middleware')

router.post('/login',login)
router.post('/logout',logout)
router.post('/signup',signup)
// router.get('/tp',isAuthenticated,(req,res)=>{
//     return res.status(200).send("fuck ")
// })

module.exports=router