import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import StoreControllerFactory from "./factory"

export default class CreateStoreCouponController {
  static async handle(req: Request, res: Response) {
    const { active, coupon_code, discount, validation_date } = req.body
    const getToken = req.cookies["voucher-token"]

    const { data: tokenData } = retrieveJwt(getToken) as JwtSchema

    const { createCouponStoreService } = StoreControllerFactory.handle()

    try {
      await createCouponStoreService.handle({
        active,
        coupon_code,
        discount,
        userId: tokenData.id,
        validation_date,
      })

      return res.status(201).send({ message: "Coupon successfully created." })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
