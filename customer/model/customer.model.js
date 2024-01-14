const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const customerSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username is required"],
        unique:[true,"username is already in use. use a new one"]
    },
    password:{
        type:String,
        required:[true, "password is required"],
        minlength:[8,"password should contain atleast 8 characters"]
    },
    email:{
        type:String,
        required:[true, "email is required"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not a valid email address")
            }
        }
    },
    phone:{
        type:String,
        required:[true, "phone number is required"],
        minlength:[10, "phone number should contain atleast 10 digits"],
        maxlength:[10, "phone number should contain atmax 10 digits"]
    },
    productsListed:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"product"
        }
    ]
})

//to hash the password given by customer
customerSchema.methods.hashPassword=async function(){
    try{
        const hashedPassword=await bcrypt.hash(this.password,10)
        this.password=hashedPassword
    }catch{
        res.status(500).json({
            "error":"internal server error",
            "msg":err.message
        })
    }
}

//to compare the password provided with existing password
customerSchema.methods.cmpPassword=async function(password){
    try{
        return await bcrypt.compare(password,this.password)
    }catch{
        res.status(500).json({
            "error":"internal server error",
            "msg":err.message
        })
    }
}

//to generate json web token
customerSchema.methods.generateToken=async function(){
    try{
        const token=await jwt.sign({_id:this.id},process.env.SECRET_KEY,{
            expiresIn:'1d'
        })
        return token
    }catch{
        res.status(500).json({
            "error":"internal server error",
            "msg":err.message
        })
    }
}

module.exports=new mongoose.model("customer",customerSchema)