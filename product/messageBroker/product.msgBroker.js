const amqp=require('amqplib')

var connection,channel
async function connect(){
    const amqpServer="amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
}
connect()

async function getChannel(){
    await connect()
    return channel
}

module.exports=getChannel