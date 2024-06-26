const customerModel = require('../model/customer.model');
const addressModel = require("../model/address.model")

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const existingCustomer = await customerModel.findOne({ username })
        if (!existingCustomer) {
            return res.status(401).json({
                "status": "error",
                "msg": "username is not registered !",
                "renderTo": "RegisterScreen"
            })
        }

        const isSamePassword = await existingCustomer.cmpPassword(password)
        if (!isSamePassword) {
            return res.status(401).json({
                "status": "error",
                "msg": "password not matched !"
            })
        }
        const token = await existingCustomer.generateToken()
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true
        })

        return res.status(200).json({
            "status": "success",
            "msg": "customer logged in successfully",
            "customer": existingCustomer,
            "token": token
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('jwt')
        return res.status(200).json({
            "status": "success",
            "msg": "customer logged out",
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

const signup = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body

        const newCustomer = new customerModel({
            username,
            email,
            password,
            phone
        })
        await newCustomer.hashPassword()

        const saveCustomer = await newCustomer.save()
        const token = await saveCustomer.generateToken()
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true
        })

        return res.status(200).json({
            "status": "success",
            "msg": "customer created successfully",
            "customer": saveCustomer,
            "token": token
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

const completeUserProfile = async (req, res) => {
    try {
        const { name, houseNo, pinCode, addressLine, city, country } = req.body;

        const verify = req.verify;

        const address = new addressModel({
            houseNo,
            pinCode,
            addressLine,
            city,
            country
        })

        const saveAddress = await address.save();

        const updatedCustomer = await customerModel.findByIdAndUpdate(verify._id, {
            $set: {
                name: name,
                userAddress: saveAddress
            }
        }, { new: true });

        return res.status(200).json({
            "status": "success",
            "msg": "user profile completed successfully",
            "customer": updatedCustomer,
            "token": token
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

module.exports = {
    login,
    logout,
    signup,
    completeUserProfile
}