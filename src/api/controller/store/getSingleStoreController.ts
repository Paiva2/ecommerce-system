import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService } from "../../@types/types"

export default class GetSingleStoreController {
  static async handle(req: Request, res: Response) {
    const params = req.params

    const { getSingleStoreService } = StoreControllerFactory.handle()

    try {
      const { store } = await getSingleStoreService.execute({
        storeId: params.storeId ?? "",
      })

      return res.status(200).send(store)
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
