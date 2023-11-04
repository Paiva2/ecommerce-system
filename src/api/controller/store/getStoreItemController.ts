import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService } from "../../@types/types"

interface IStoreParameters {
  storeId: string
  itemId: string
}

export default class GetStoreItemController {
  static async handle(req: Request<{}, {}, {}, IStoreParameters>, res: Response) {
    const storeParameters = req.query

    let storeId: string
    let itemId: string

    if (
      !storeParameters.storeId ||
      !storeParameters.itemId ||
      storeParameters.storeId === "null" ||
      storeParameters.itemId === "null"
    ) {
      return res.status(422).send({ message: "Invalid store id and item id." })
    }

    console.log(storeParameters)

    storeId = storeParameters.storeId
    itemId = storeParameters.itemId

    const { getStoreItemService } = StoreControllerFactory.handle()

    try {
      const { storeItem } = await getStoreItemService.execute({
        itemId,
        storeId,
      })

      return res.status(200).send(storeItem)
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
