const express=require('express')
const dotenv=require('dotenv')
const cookieParser = require('cookie-parser');
const authRouter=require('./routes/customer.auth.route')
const router=require('./routes/customer.route')
require('./config/db.config')
require('./config/rabbitmq.config')
dotenv.config()

const app =express()
const port=process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())

app.use('/api/customer/auth',authRouter)
app.use('/api/customer/',router)
app.get('*',(req,res)=>{
    res.status(404).json({
        status:"error",
        msg:"page not found"
    })
})

app.listen(port,()=>{
    console.log(`Connected at port ${port}`);
})
