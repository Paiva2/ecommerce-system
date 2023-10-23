import { Request, Response } from "express"
import StoreControllerFactory from "./factory"

export default class GetAllStoresController {
  async handle(_: Request, res: Response) {
    const factory = new StoreControllerFactory()

    const { getAllStoresService } = factory.handle()

    try {
      const { stores } = await getAllStoresService.execute()

      return res.status(200).send({ data: stores })
    } catch (e) {
      return res.status(500).send({ error: e })
    }
  }
}
