const mongoose = require('mongoose');

const addressSchema=mongoose.Schema({
    houseNo: {
        type:Number,
        required:true
    },
    pinCode: {
        type:Number,
        validate:{
            validator: function(value) {
                return /^[0-9]{6}$/.test(value);
            },
            message: "not a valid pin code"
        }
    },
    addressLine: {
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
})

module.exports=new mongoose.model("address", addressSchema)