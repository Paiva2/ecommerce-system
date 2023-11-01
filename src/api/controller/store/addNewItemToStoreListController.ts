import { Request, Response } from "express"
import { ErrorService, JwtSchema, StoreItemRequestPayload } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"
import StoreControllerFactory from "./factory"
import readCsv from "../../../utils/readCsv"

export default class AddNewItemToStoreListController {
  static async handle(req: Request, res: Response) {
    const reqItemList = req.body
    let itemList = [] as StoreItemRequestPayload[]
    const token = req.cookies["voucher-token"]

    if (req.file) {
      itemList = await readCsv(req.file.path)
    } else {
      itemList = reqItemList.itemList
    }

    const { data: tokenData } = retrieveJwt(token) as JwtSchema

    const { addNewItemToStoreListService } = StoreControllerFactory.handle()

    try {
      await addNewItemToStoreListService.handle({
        userEmail: tokenData.email,
        itemList,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      console.log(e)

      return res.status(err.status).send({ message: err.error })
    }
  }
}
