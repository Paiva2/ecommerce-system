import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"

export default class UpdateUserStoreCoinController {
  static async handle(req: Request, res: Response) {
    const { userToUpdate, newValue } = req.body

    const token = req.cookies["voucher-token"]

    const parseToken = retrieveJwt(token) as JwtSchema

    const { updateUserStoreCoinService } = StoreControllerFactory.handle()

    try {
      await updateUserStoreCoinService.execute({
        newValue,
        storeOwnerEmail: parseToken.data.email,
        userToUpdate,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
