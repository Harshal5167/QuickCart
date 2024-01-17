const productModel=require('../model/product.model')

const getProductBody=async(data)=>{
    const productsWithBody=await Promise.all(data.map(async(productId)=>{
        const productFromDB=await productModel.findById(productId)

        const productWithBody={
            "name":productFromDB.name,
            "description":productFromDB.description,
            "cost":productFromDB.cost
        }
        return productWithBody
    }))

    return productsWithBody
}

module.exports={
    getProductBody
}