const customerModel = require('../model/customer.model');

const login=async(req,res)=>{
    try{
        const {username,password}=req.body

        const existingCustomer=await customerModel.find({username})
        if(!existingCustomer){
            return res.status(401).json({
                "status":"error",
                "msg":"username is not registered"
            })
        }

        const isSamePassword= await existingCustomer[0].cmpPassword(password)
        if(!isSamePassword){
            return res.status(401).json({
                "status":"error",
                "msg":"password not matched"
            })
        }
        const token=await existingCustomer[0].generateToken()
        res.cookie('jwt',token,{
            httpOnly:true,
            secure:true
        })

        res.status(200).json({
            "status":"success",
            "msg":"customer logged in successfully",
            "customer":existingCustomer,
            "token":token
        })
    }catch(err){
        res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

const logout=(req,res)=>{
    try{
        res.clearCookie('jwt')
        res.status(200).json({
            "status":"success",
            "msg":"customer logged out",
        })
    }catch(err){
        res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

const signup=async(req,res)=>{
    try{
        const {username,email,password,phone}=req.body

        const newCustomer=new customerModel({
            username,
            email,
            password,
            phone
        })
        await newCustomer.hashPassword()

        const saveCustomer=await newCustomer.save()
        const token=await saveCustomer.generateToken()
        res.cookie('jwt',token,{
            httpOnly:true,
            secure:true
        })

        res.status(200).json({
            "status":"success",
            "msg":"customer creater successfully",
            "customer":saveCustomer,
            "token":token
        })
    }catch(err){
        res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

module.exports={
    login,
    logout,
    signup
}