const multer=require('multer')
const { v4:uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        cb(null,`${uuidv4()}_${file.originalname}`)
    }
})

function fileFilter(req,file,cb){
    if(file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpeg' || 
       file.mimetype === 'image/jpg'){
        cb(null,true)
    }else{
        req.fileValidationError='Unsupported filetype'
        cb(null,false)
    }
}

const upload=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        fileFilter(req,file,cb)
    },
    limits:{
        fileSize:1024*1024 //1MB
    }
})

module.exports=upload