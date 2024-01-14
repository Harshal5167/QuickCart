const customerModel = require('../model/customer.model');

const findCustomerById=async(verify)=>{
    try{
        const customer=await customerModel.findById(verify._id)
        if(!customer){
            throw new Error({
                "status":"error",
                "msg":"customer not found"
            })
        }
        return customer
    }catch(err){
        console.log(err);
        throw new Error({
            "error":err,
        })
    }
}

const updateProductsListedByCustomer=async(data)=>{
    try{
        const customer=await customerModel.findById(data.customer._id)
        if(!customer){
            throw new Error({
                "status":"error",
                "msg":"customer not found"
            })
        }
        customer.productsListed.push(data.saveProduct._id)
    }catch(err){
        console.log(err);
        throw new Error({
            "error":err,
        })
    }
}

module.exports={
    findCustomerById,
    updateProductsListedByCustomer
}