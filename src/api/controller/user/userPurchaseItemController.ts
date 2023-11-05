import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import StoreControllerFactory from "../store/factory"

//TODO E2E TESTS
export default class UserPurchaseItemController {
  static async handle(req: Request, res: Response) {
    const { storeId, itemsId, quantity } = req.body

    const token = req.cookies["voucher-token"]
    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const { userPurchaseItemService } = StoreControllerFactory.handle()

    try {
      await userPurchaseItemService.execute({
        userId: decodedToken.id,
        itemsId,
        quantity,
        storeId,
      })

      return res.status(204).send({ message: "Purchase success!" })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
