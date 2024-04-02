const customerModel = require('../model/customer.model');

const findCustomerById = async (verify) => {
    try {
        const customer = await customerModel.findById(verify)
        if (!customer) {
            throw new Error({
                "status": "error",
                "msg": "customer not found"
            })
        }
        return customer
    } catch (err) {
        console.log(err);
        // throw new Error({
        //     "error":err,
        // })
    }
}

const updateProductsListedByCustomer = async (data) => {
    try {
        const customer = await customerModel.findById(data.soldBy._id)
        if (!customer) {
            throw new Error({
                "status": "error",
                "msg": "customer not found"
            })
        }
        await customerModel.findByIdAndUpdate(data.soldBy._id, { $push: { productsListed: data.saveProduct._id } }, { new: true })
    } catch (err) {
        console.log(err);
        throw new Error({
            "error": err
        })
    }
}

const getProductIdArrayFromCustomer = async (data) => {
    try {
        const productIdArray = await customerModel.findById(data._id, "productsListed")
        if (!productIdArray) {
            throw new Error({
                "status": "error",
                "msg": "not found"
            })
        }
        return productIdArray.productsListed
    } catch (err) {
        console.log(err);
        // throw new Error({
        //     "error": err
        // })
    }
}

module.exports = {
    findCustomerById,
    updateProductsListedByCustomer,
    getProductIdArrayFromCustomer
}