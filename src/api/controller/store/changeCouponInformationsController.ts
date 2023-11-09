import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import StoreControllerFactory from "./factory"

export default class ChangeCouponInformationsController {
  static async handle(req: Request, res: Response) {
    const { couponId, infosToUpdate } = req.body
    const authToken = req.cookies["voucher-token"]

    const { data: tokenData } = retrieveJwt(authToken) as JwtSchema

    const { changeCouponInformationService } = StoreControllerFactory.handle()

    try {
      await changeCouponInformationService.execute({
        couponId,
        infosToUpdate,
        userId: tokenData.id,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
