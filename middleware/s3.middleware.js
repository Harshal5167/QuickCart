const {S3} = require('@aws-sdk/client-s3');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.REGION
});

const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME, 
        Body: fileStream,
        Key: file.filename
    };
    return s3.putObject(uploadParams)
};

module.exports = {
    uploadFile
}
