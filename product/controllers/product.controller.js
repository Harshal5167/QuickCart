const productModel = require('../model/product.model')
const config = require('../config/rabbitmq.config')
const { uploadFile } = require('../../middleware/s3.middleware')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const dotenv = require('dotenv')
dotenv.config()

let customer
const sellProduct = async (req, res) => {
    try {
        const { name, category, description, cost } = req.body
        const verify = req.verify
        let imageURL
        await (async () => {
            if (req.file) {
                const file = req.file

                if (req.fileValidationError) {
                    return res.status(400).json({
                        "status": "error",
                        "msg": req.fileValidationError
                    })
                }
                await uploadFile(file)
                imageURL = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${encodeURIComponent(file.filename)}`

                const unlinkFile = util.promisify(fs.unlink)
                await unlinkFile(file.path)
            }
        })();

        const channel = await config.getChannel()

        await channel.assertQueue("customerForProduct-Product");
        channel.sendToQueue(
            "customerForProduct-Customer",
            Buffer.from(JSON.stringify(verify))
        )
        setTimeout(() => {
            channel.consume("customerForProduct-Product", (data) => {
                customer = JSON.parse(data.content)
                channel.ack(data)
            })
        }, 300)

        setTimeout(async () => {
            const Rating = {
                totalRatings: 0,
                avgRating: 0
            }
            if (!customer) {
                await unlinkFile(req.file.path)

                return res.status(500).json({
                    status: "internal server error",
                    msg: "error while fetching data from other service. Please try again"
                })
            }
            const soldBy = {
                "_id": customer._id,
                "username": customer.username,
                "email": customer.email,
                "phone": customer.phone
            }

            const newProduct = new productModel({
                name,
                category,
                description,
                imageURL,
                cost,
                soldBy,
                Rating
            })
            const saveProduct = await newProduct.save()

            channel.sendToQueue("productByCustomer-Customer",
                Buffer.from(JSON.stringify({ soldBy, saveProduct }))
            )

            return res.status(200).json({
                "status": "success",
                "msg": "product created successfully",
                "product": saveProduct
            })
        }, 500)
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}


const getProducts = async (req, res) => {
    try {
        const products = await productModel.find().limit(20)

        const productsWithCustomer = products.map((product) => {
            const toShow = {
                "name": product.name,
                "description": product.description,
                "cost": product.cost,
                "imageURL": product.imageURL,
                "soldBy": {
                    "username": product.soldBy.username,
                    "email": product.soldBy.email,
                    "phone": product.soldBy.phone
                }
            }
            return toShow
        })

        return res.status(200).json({
            "status": "success",
            "products": productsWithCustomer
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

const rateProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        const rating = req.body.rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                "status": "error",
                "msg": "rating should be between 1 to 5"
            })
        }
        const totalRatings = product.Rating.totalRatings + 1
        let avgRating = ((Number(product.Rating.avgRating) * (totalRatings - 1)) + rating) / totalRatings
        avgRating.toFixed(2)

        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: product._id },
            {
                $set: {
                    Rating: {
                        totalRatings,
                        avgRating
                    }
                }
            },
            { new: true }
        )
        return res.status(200).json({
            "status": "success",
            "msg": "rating added successfully",
            "product": updatedProduct
        })

    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

let productIdArray;
const getProductsByUserUsingIds = async (req, res) => {
    try {
        const verify = req.verify

        const channel = await config.getChannel()

        await channel.assertQueue("productIdArrayFromCustomer-Product");
        channel.sendToQueue(
            "productIdArrayFromCustomer-Customer",
            Buffer.from(JSON.stringify(verify))
        )
        setTimeout(() => {
            channel.consume("productIdArrayFromCustomer-Product", (data) => {
                productIdArray = JSON.parse(data.content)
                channel.ack(data)
            })
        }, 1500)

        setTimeout(async () => {
            console.log(productIdArray);

            let productsListed = await Promise.all(productIdArray.map(async (id) => {
                const product = await productModel.findById(id, "name _id cost imageURL");
                return product
            }));

            return res.status(200).json({
                "status": "success",
                "msg": "products listed by user fetched successfully",
                "products": productsListed
            })
        }, 1600)
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category

        const products = await productModel.find({ category }).limit(10)
        const productsByCategory = products.map((product) => {
            const toShow = {
                "name": product.name,
                "description": product.description,
                "cost": product.cost,
                "imageURL": product.imageURL,
                "soldBy": {
                    "username": product.soldBy.username,
                    "email": product.soldBy.email,
                    "phone": product.soldBy.phone
                }
            }
            return toShow
        })

        return res.status(200).json({
            "status": "success",
            "products": productsByCategory
        })
    } catch (err) {
        return res.status(500).json({
            "status": "internal server error",
            "msg": err.message
        })
    }
}


module.exports = {
    sellProduct,
    getProducts,
    rateProduct,
    getProductsByCategory,
    getProductsByUserUsingIds,
}