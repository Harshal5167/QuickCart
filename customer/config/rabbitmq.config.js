const amqp = require('amqplib')
const {
    findCustomerById,
    updateProductsListedByCustomer,
    getProductIdArrayFromCustomer
} = require('../controllers/customer.msgBroker.controller');

const amqpConnect = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
        return channel
    } catch (err) {
        console.log(err);
        console.log("Error connecting to RabbitMQ");
    }
}

let channel
async function initializeQueue() {
    channel = await amqpConnect();
    await channel.assertQueue("productByCustomer-Customer")
    await channel.assertQueue("customerForProduct-Customer")
    await channel.assertQueue("productIdArrayFromCustomer-Customer")
    channel.consume("customerForProduct-Customer", customerForProduct)
    channel.consume('productByCustomer-Customer', productByCustomer)
    channel.consume('productIdArrayFromCustomer-Customer', productIdArrayFromCustomer)
}
initializeQueue()

const customerForProduct = async (data) => {
    const verify = JSON.parse(data.content)
    const customer = await findCustomerById(verify)
    channel.sendToQueue(
        "customerForProduct-Product",
        Buffer.from(JSON.stringify(customer))
    );
    channel.ack(data)
}

const productByCustomer = async (data) => {
    const { soldBy, saveProduct } = JSON.parse(data.content)
    await updateProductsListedByCustomer({ soldBy, saveProduct })
    channel.ack(data)
}

const productIdArrayFromCustomer = async (data) => {
    const verify = JSON.parse(data.content)
    const productIdArray = await getProductIdArrayFromCustomer(verify)
    channel.sendToQueue(
        "productIdArrayFromCustomer-Product",
        Buffer.from(JSON.stringify(productIdArray))
    );
    channel.ack(data)
}

async function getChannel() {
    if (!channel) await initializeQueue()
    return channel
}

module.exports = getChannel