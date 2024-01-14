const amqp=require('amqplib')
const {
    findCustomerById,
    updateProductsListedByCustomer
}=require('../controllers/customer.controller')

var connection,channel
async function connect(){
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("customerForProduct-Customer");
    await channel.assertQueue("productByCustomer-Customer");
    channel.consume("customerForProduct-Customer",customerForProduct)
    channel.consume('productByCustomer-Customer',productByCustomer)
}
connect()

const customerForProduct=async(data)=>{
    const verify=JSON.parse(data.content)
    channel.ack(data)
    const customer=await findCustomerById(verify)
    channel.sendToQueue(
        "customerForProduct-Product",
        Buffer.from(JSON.stringify(customer))
    );
}

const productByCustomer=async(data)=>{
    const {customer,saveProduct}=JSON.parse(data.content)
    channel.ack(data)
    await updateProductsListedByCustomer({customer,saveProduct})
}

