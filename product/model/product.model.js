const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, "provide a name for the product"]
    },
    category:{
        type:String,
        required:[true, "provide a category for the product"]
    },
    description:{
        type:String,
        required:[true, "provide a description for the product"]
    },
    cost:{
        type:Number,
        required:[true, "assign a cost for the product"]
    },
    imageURL:{
        type:String
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