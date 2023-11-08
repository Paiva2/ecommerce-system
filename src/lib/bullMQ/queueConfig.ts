import { Queue, Worker } from "bullmq"
import IORedis from "ioredis"
import { transporter } from "../nodemailer"

export const redisConnection = {
  maxRetriesPerRequest: null,
  port: 6379,
  host: "redis://:redis@localhost:6379",
}

const connection = new IORedis(redisConnection)

const queues = ["mailQueue"]

export const queue = []
export const workers = []

queues.forEach((queueName) => {
  queue.push(new Queue(queueName, { connection }))
  workers.push(queueName)
})

workers.forEach((qName) => {
  const worker = new Worker(
    qName,
    async (job) => {
      if (job.name === "nodemailer") {
        transporter.sendMail(job.data, (err) => {
          if (err) {
            console.log("Error: " + err)
          }
        })
      }

      console.log(`${job.name} has completed!`)
    },
    { connection }
  )

  worker.on("failed", (job, err) => {
    console.log(`${job.name} has failed with ${err.message}`)
  })
})
