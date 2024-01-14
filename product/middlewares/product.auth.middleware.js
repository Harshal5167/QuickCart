const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const amqp=require('amqplib')
const getChannel=require('../messageBroker/product.msgBroker')
dotenv.config()

const isAuthenticated=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                status:"error",
                msg:"token not provided"
            })
        }

        const verify= jwt.verify(token,process.env.SECRET_KEY)

        const channel=await getChannel()
        await channel.assertQueue("customerForProduct-Product");
        channel.sendToQueue(
            "customerForProduct-Customer",
            Buffer.from(JSON.stringify(verify))
        )
        
        channel.consume("customerForProduct-Product",(data)=>{
            customer=JSON.parse(data.content)
            channel.ack(data)
            req.body.customer=customer
            next()
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            "status":"internal server error",
            "msg":err.message
        })
    }
}

module.exports=isAuthenticated