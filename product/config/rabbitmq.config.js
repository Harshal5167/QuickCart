const amqp = require("amqplib");
const {
    getProductBody,
} = require("../controllers/product.msgBroker.controller");

const amqpConnect = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
        return channel;
    } catch (err) {
        console.log(err);
        console.log("Error connecting to RabbitMQ");
    }
};

let channel;
async function initializeQueue() {
    channel = await amqpConnect();
    await channel.assertQueue("ProductsListedByCustomer-Product");
    channel.consume("ProductsListedByCustomer-Product", ProductsListedByCustomer);
}
initializeQueue();

const ProductsListedByCustomer = async (data) => {
    const productList = JSON.parse(data.content);
    const productsWithBody = await getProductBody(productList);
    channel.sendToQueue(
        "ProductsListedByCustomer-Customer",
        Buffer.from(JSON.stringify(productsWithBody))
    );
    channel.ack(data);
};

async function getChannel() {
    if (!channel) await initializeQueue();
    return channel;
}

module.exports = {
    getChannel,
};
