import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import UserControllerFactory from "./factory"

export default class InsertItemToWishListController {
  static async handle(req: Request, res: Response) {
    const { itemId } = req.body

    const authToken = req.cookies["voucher-token"]
    const { data: userTokenData } = retrieveJwt(authToken) as JwtSchema

    const { insertItemToWishListService } = UserControllerFactory.handle()

    try {
      await insertItemToWishListService.execute({
        itemId,
        userId: userTokenData.id,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
