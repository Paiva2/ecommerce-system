import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService } from "../../@types/types"

export default class GetStoreItemListController {
  static async handle(req: Request, res: Response) {
    const storeListParams = req.params
    const storeListParamsPage = req.query

    const { getStoreItemListService } = StoreControllerFactory.handle()

    try {
      const { storeItemList } = await getStoreItemListService.execute({
        page: Number(storeListParamsPage.page),
        storeId: storeListParams.storeId,
      })

      return res.status(200).send(storeItemList)
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
