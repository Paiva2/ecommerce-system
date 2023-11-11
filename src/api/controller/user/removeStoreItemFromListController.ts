import { Request, Response } from "express"
import retrieveJwt from "../../../utils/retrieveJwt"
import { ErrorService, JwtSchema } from "../../@types/types"
import UserControllerFactory from "./factory"

export default class RemoveStoreItemFromListController {
  static async handle(req: Request, res: Response) {
    const { itemId } = req.body

    const getToken = req.cookies["voucher-token"]

    const { data: userTokenData } = retrieveJwt(getToken) as JwtSchema

    const { removeStoreItemfromListService } = UserControllerFactory.handle()

    try {
      await removeStoreItemfromListService.execute({
        itemId,
        userId: userTokenData.id,
      })

      return res.status(200).send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
