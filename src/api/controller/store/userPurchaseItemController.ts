import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import StoreControllerFactory from "./factory"

export default class UserPurchaseItemController {
  static async handle(req: Request, res: Response) {
    const { storeId, itemId, quantity } = req.body

    const token = req.cookies["voucher-token"]
    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const { userPurchaseItemService } = StoreControllerFactory.handle()

    try {
      await userPurchaseItemService.execute({
        userId: decodedToken.id,
        itemId,
        quantity,
        storeId,
      })

      return res.status(204).send({ message: "Purchase success!" })
    } catch (e) {
      const err = e as ErrorService

      console.log(e)

      return res.status(err.status).send({ message: err.error })
    }
  }
}
