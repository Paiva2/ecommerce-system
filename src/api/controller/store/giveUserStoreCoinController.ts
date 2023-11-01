import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"

export default class GiveUserStoreCoinController {
  static async handle(req: Request, res: Response) {
    const { userToReceive, valueToGive } = req.body
    const token = req.cookies["voucher-token"]

    const parseToken = retrieveJwt(token) as JwtSchema

    const { giveUserStoreCoinService } = StoreControllerFactory.handle()

    try {
      await giveUserStoreCoinService.execute({
        storeOwnerEmail: parseToken.data.email,
        userToReceive,
        valueToGive,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
