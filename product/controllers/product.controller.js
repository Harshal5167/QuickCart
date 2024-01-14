const productModel=require('../model/product.model')
const getChannel=require('../messageBroker/product.msgBroker')
const amqp=require('amqplib')

const createProduct=async(req,res)=>{
    try{
        const {name,description,cost}=req.body
        const customer=req.body.customer
        const soldBy=customer._id

        const newProduct=new productModel({
            name,
            description,
            cost,
            soldBy
        })
        const saveProduct=await newProduct.save()
        
        const channel=await getChannel()
        channel.sendToQueue('productByCustomer-Customer',
            Buffer.from(JSON.stringify({customer,saveProduct}))
        )

        res.status(200).json({
            "status":"success",
            "msg":"product creater successfully",
            "product":saveProduct
        })
        
    }catch(err){
        res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

module.exports={
    createProduct
}