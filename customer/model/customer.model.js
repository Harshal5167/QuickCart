const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const addressModel = require("./address.model")

const customerSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username is required"],
        unique:[true, "username already registered."],
        minlength:[3, "username should be of atleast 3 charcters"]
    },
    password:{
        type:String,
        required:[true, "password is required"],
        minlength:[8,"password should contain atleast 8 characters"]
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:[true, "email already registered."],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not a valid email address")
            }
        }
    },
    phone:{
        type:Number,
        required:[true, "phone number is required"],
        unique:[true, "phone number already registered"],
        validate:{
            validator: function(value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: "not a valid phone number"
        }
    },
    productsListed:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"product"
        }
    ],
    name:{
        type:String,
    },
    userAddress: {
        type:Object,
        ref:addressModel
    }
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
            expiresIn:'10d'
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