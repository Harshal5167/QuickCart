const productModel=require('../model/product.model')
const config=require('../config/rabbitmq.config')

let customer
const createProduct=async(req,res)=>{
    try{
        const {name,description,cost}=req.body
        const verify=req.body.verify

        const channel=await config.getChannel()

        await channel.assertQueue("customerForProduct-Product");
        channel.sendToQueue(
            "customerForProduct-Customer",
            Buffer.from(JSON.stringify(verify))
        )
        await (async () => channel.consume("customerForProduct-Product",(data)=>{
            customer=JSON.parse(data.content)
            channel.ack(data)
        }))();
        
        const Rating={
            totalRatings:0,
            avgRating:0
        }
        if(!customer){
            return res.status(500).json({
                "status":"internal server error",
                "msg":"error while fetching data from other service. Please try again"
            })
        }
        const soldBy={
            "_id":customer._id,
            "username":customer.username,
            "email":customer.email,
            "phone":customer.phone
        }
        const newProduct=new productModel({
            name,
            description,
            cost,
            soldBy,
            Rating
        })
        const saveProduct=await newProduct.save()

        channel.sendToQueue("productByCustomer-Customer",
            Buffer.from(JSON.stringify({soldBy,saveProduct}))
        )

        return res.status(200).json({
            "status":"success",
            "msg":"product created successfully",
            "product":saveProduct
        })
        
    }catch(err){
        return res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}
 
const getProducts=async(req,res)=>{
    try{
        const products=await productModel.find().limit(20)
        
        const productsWithCustomer=products.map((product)=>{
            const toShow={
                "name":product.name,
                "description":product.description,
                "cost":product.cost,
                "soldBy":{
                    "username":product.soldBy.username,
                    "email":product.soldBy.email,
                    "phone":product.soldBy.phone
                }
            }
            return toShow
        })

        return res.status(200).json({
            "status":"success",
            "products":productsWithCustomer
        })
    }catch(err){
        return res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

const rateProduct=async (req,res)=>{
    try{
        const product=await productModel.findById(req.params.id)
        const rating =req.body.rating

        if(rating<1 || rating>5){
            return res.status(400).json({
                "status":"error",
                "msg":"rating should be between 1 to 10"
            })
        }
        const totalRatings=product.Rating.totalRatings+1
        let avgRating=((Number(product.Rating.avgRating)*(totalRatings-1))+rating)/totalRatings
        avgRating.toFixed(2)

        const updatedProduct=await productModel.findOneAndUpdate(
            {_id: product._id},
            {$set:{
                Rating:{
                    totalRatings,
                    avgRating
                }
            }},
            {new:true}
        )
        return res.status(200).json({
            "status":"success",
            "msg":"rating added successfully",
            "product":updatedProduct
        })

    }catch(err){
        return res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

module.exports={
    createProduct,
    getProducts,
    rateProduct
}