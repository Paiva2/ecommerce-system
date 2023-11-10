import { Request, Response } from "express"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"
import UserControllerFactory from "./factory"

export default class RemoveItemFromWishListController {
  static async handle(req: Request, res: Response) {
    const { itemId } = req.body

    const authToken = req.cookies["voucher-token"]
    const { data: userTokenData } = retrieveJwt(authToken) as JwtSchema

    const { removeItemFromWishListService } = UserControllerFactory.handle()

    try {
      await removeItemFromWishListService.execute({
        itemId,
        userId: userTokenData.id,
      })

      return res.status(200).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
