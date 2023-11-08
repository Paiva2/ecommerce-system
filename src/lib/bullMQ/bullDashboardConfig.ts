import { ExpressAdapter } from "@bull-board/express"
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { queue } from "./queueConfig"

export const serverAdapter = new ExpressAdapter()

serverAdapter.setBasePath("/ui")

export const bullBoard = createBullBoard({
  queues: queue.map((q) => new BullMQAdapter(q)),
  serverAdapter,
})
