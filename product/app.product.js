const express = require('express');
const router=require('./routes/product.routes')
const cookieParser=require('cookie-parser')
require('./config/db.config.js')
require('./config/rabbitmq.config.js')
const dotenv=require('dotenv')
dotenv.config()

const port=process.env.PORT || 6001
const app=express()

app.use(cookieParser())
app.use(express.json())

app.use('/api/product/',router)
app.get('*',(req,res)=>{
    res.status(404).json({
        status:"error",
        msg:"page not found"
    })
})

app.listen(port,()=>{
    console.log(`Connected at port ${port}`);
})
