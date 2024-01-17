const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    soldBy:{
        type:mongoose.Schema.Types.Mixed,
        ref:"customer",
        required: [true, "product must belong to some user"]
    },
    Rating:{
        totalRatings:{
            type:Number
        },
        avgRating:{
            type:Number
        }
    }
})

module.exports=new mongoose.model('product',productSchema)