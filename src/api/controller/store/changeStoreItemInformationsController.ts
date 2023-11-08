import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"

export default class ChangeStoreItemInformationsController {
  constructor() {}

  static async handle(req: Request, res: Response) {
    const { itemId, informationsToUpdate } = req.body

    const token = req.cookies["voucher-token"]

    const parseUserToken = retrieveJwt(token) as JwtSchema

    const { changeStoreItemInformationsService } = StoreControllerFactory.handle()

    try {
      await changeStoreItemInformationsService.execute({
        userId: parseUserToken.data.id,
        itemId,
        informationsToUpdate,
      })

      return res.status(204).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
