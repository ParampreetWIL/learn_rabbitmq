import Express from "express";
import { task } from "./model/validation";
import * as amqp from "amqplib";
import { config } from "dotenv";

config({
  path: "../../.env",
});
let PORT = process.env.PRODUCER_PORT || 3000;

const app = Express();
app.use(Express.json());

app.post("/sendTask", async (req, res) => {
  let parsedData;
  try {
    parsedData = task.parse(req.body);

    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@param_network`
    );
    const channel = await connection.createChannel();

    const queue = process.env.RABBITMQ_QUEUE || "TaskQueue";
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(parsedData)));

    console.log("Message sent:");
    console.log(parsedData);

    res.send("Ok");

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`Producer live at http://localhost:${PORT}`);
});
