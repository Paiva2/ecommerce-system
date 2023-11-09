import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import UserControllerFactory from "./factory"

export default class ListAllUserStoreCouponsController {
  static async handle(req: Request, res: Response) {
    const getToken = req.cookies["voucher-token"]

    const { data: userTokenData } = retrieveJwt(getToken) as JwtSchema

    const { listAllUserStoreCouponsService } = UserControllerFactory.handle()

    try {
      const { storeCoupons } = await listAllUserStoreCouponsService.execute({
        userId: userTokenData.id,
      })

      return res.status(200).send({ data: storeCoupons })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
