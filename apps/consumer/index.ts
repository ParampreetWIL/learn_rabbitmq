import Express from "express";
import * as amqp from "amqplib";
import { config } from "dotenv";

config({
  path: "../../.env",
});

const app = Express();
app.use(Express.json());

let PORT = process.env.CONSUMER_PORT || 4000;
let tasks = [];

app.get("/getTask", async (req, res) => {
  const connection = await amqp.connect(
    `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@param_network`
  );
  const channel = await connection.createChannel();
  const queue = process.env.RABBITMQ_QUEUE || "TaskQueue";
  await channel.assertQueue(queue, { durable: true });
  channel.get(queue, { noAck: false }).then((msg) => {
    if (!msg) {
      res.status(400).send("Message is Null or Undefined");
      return;
    }
    console.log("Received:", msg.content.toString());
    tasks.push(JSON.parse(msg.content.toString()));
    channel.ack(msg);
    res.send({
      status: "Task Received",
      task: JSON.parse(msg.content.toString()),
    });
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});

app.listen(PORT, () => {
  console.log(`Consumer live at http://localhost:${PORT}`);
});
