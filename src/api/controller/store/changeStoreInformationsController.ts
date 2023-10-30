import { Request, Response } from "express"
import StoreControllerFactory from "./factory"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"

export default class ChangeStoreInformationsController {
  async handle(req: Request, res: Response) {
    const storeUpdate = req.body
    const token = req.cookies["voucher-token"]

    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const { changeStoreInformationsService } = StoreControllerFactory.handle()

    try {
      await changeStoreInformationsService.execute({
        storeOwner: decodedToken.email,
        storeUpdate,
      })

      return res.status(200).send({ message: "Store informations updated." })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
