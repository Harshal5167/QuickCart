const express=require('express')
require('./config/db.config')
const dotenv=require('dotenv')
const cookieParser = require('cookie-parser');
const router=require('./routes/customer.auth.route')
require('./messageBroker/customer.msgBroker')
const app=express()
dotenv.config()

const port=process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())

app.use('/api/customer/auth',router)
app.get('*',(req,res)=>{
    res.status(404).json({
        status:"error",
        msg:"page not found"
    })
})

app.listen(port,()=>{
    console.log(`Connected at port ${port}`);
})