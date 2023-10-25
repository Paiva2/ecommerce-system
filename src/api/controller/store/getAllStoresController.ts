import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService } from "../../@types/types"

export default class GetAllStoresController {
  async handle(_: Request, res: Response) {
    const factory = new StoreControllerFactory()

    const { getAllStoresService } = factory.handle()

    try {
      const { stores } = await getAllStoresService.execute()

      return res.status(200).send({ data: stores })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
