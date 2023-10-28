import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService } from "../../@types/types"

export default class GetAllStoresController {
  async handle(_: Request, res: Response) {
    const { getAllStoresService } = StoreControllerFactory.handle()

    try {
      const { formattedStores } = await getAllStoresService.execute()

      return res.status(200).send({ data: formattedStores })
    } catch (e) {
      const err = e as ErrorService

      console.log(e)

      return res.status(err.status).send({ message: err.error })
    }
  }
}
