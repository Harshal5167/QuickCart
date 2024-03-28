const express = require('express');
const router = express.Router()
const {
    login,
    logout,
    signup,
    completeUserProfile
} = require('../controllers/customer.auth.controller')
const isAuthenticated = require("../../middleware/auth.middleware")

router.post('/login', login)
router.post('/logout', logout)
router.post('/signup', signup)
router.post('/completeUserProfile', [isAuthenticated], completeUserProfile)

module.exports = router