const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.URI)
        console.log("Connected to DB");
    }catch(err){
        console.log(err);
        console.log("Error connecting to database");
    }
}
dbConnect()
