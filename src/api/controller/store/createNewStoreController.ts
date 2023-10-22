import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import StoreControllerFactory from "./factory"

export default class CreateNewStoreController {
  async handle(req: Request, res: Response) {
    const { storeName } = req.body

    const token = req.cookies["voucher-token"]
    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const factory = new StoreControllerFactory()
    const { createNewStoreService } = factory.handle()

    try {
      await createNewStoreService.execute({
        storeName,
        storeOwner: decodedToken.email,
      })

      return res.status(201).send({ message: "Store created successfully." })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
