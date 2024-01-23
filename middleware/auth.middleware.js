const jwt=require('jsonwebtoken')

const isAuthenticated=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(401).json({
            status:"error",
            msg:"token not provided"
        })
    }

    const verify= jwt.verify(token,process.env.SECRET_KEY)
    req.verify=verify
    
    next()
}

module.exports=isAuthenticated