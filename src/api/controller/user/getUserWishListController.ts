import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import UserControllerFactory from "./factory"

export default class GetUserWishListController {
  static async handle(req: Request, res: Response) {
    const authToken = req.cookies["voucher-token"]

    const { data: userTokenData } = retrieveJwt(authToken) as JwtSchema

    const { getUserWishlistService } = UserControllerFactory.handle()

    try {
      const { getWishListItems } = await getUserWishlistService.execute({
        userId: userTokenData.id,
      })

      return res.status(200).send({ data: getWishListItems })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
