import { Request, Response } from "express"
import PgUser from "../../database/pgUser"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import PgStore from "../../database/pgStore"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"

export default class CreateNewStoreController {
  async handle(req: Request, res: Response) {
    const { storeName } = req.body

    const token = req.cookies["voucher-token"]
    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const createNewStoreService = new CreateNewStoreService(
      storeRepository,
      userRepository
    )

    //TODO: IMPEDIR DE CRIAR UMA STORE SE JA EXISTIR UMA

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
