const customerModel=require('../model/customer.model')
const getChannel=require('../config/rabbitmq.config')

let ProductsListedWithBody
const getProfile=async(req,res)=>{
    try{
        const verify=req.body.verify
        const customer=await customerModel.findById(verify._id,{
            username:1,
            email:1,
            phone:1,
            productsListed:{$slice:5}
        })
        
        const channel=await getChannel()
        await channel.assertQueue("ProductsListedByCustomer-Customer")
        channel.sendToQueue(
            "ProductsListedByCustomer-Product",
            Buffer.from(JSON.stringify(customer.productsListed))
        )
        await (async ()=>channel.consume(
            "ProductsListedByCustomer-Customer",
            (data)=>{
                ProductsListedWithBody=JSON.parse(data.content)
                channel.ack(data)
            }
        ))()
        
        if(!ProductsListedWithBody){
            return res.status(500).json({
                "status":"internal server error",
                "msg":"error while fetching data from other service. Please try again"
            })
        }

        return res.status(200).json({
            "status":"success",
            "customer":{
                "username":customer.username,
                "email":customer.email,
                "phone":customer.phone,
                "productsListed":ProductsListedWithBody
            }
        })
    }catch(err){
        return res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

module.exports={
    getProfile
}