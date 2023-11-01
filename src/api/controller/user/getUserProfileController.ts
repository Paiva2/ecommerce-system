import { Request, Response } from "express"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"
import UserControllerFactory from "./factory"

export default class GetUserProfileController {
  static async handle(req: Request, res: Response) {
    const token = req.cookies["voucher-token"]

    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const { getUserProfileService } = UserControllerFactory.handle()

    try {
      const { user } = await getUserProfileService.execute({
        userEmail: decodedToken.email,
      })

      return res.status(200).send({ data: user })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
