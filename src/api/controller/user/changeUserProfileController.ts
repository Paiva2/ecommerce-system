import { Request, Response } from "express"
import UserControllerFactory from "./factory"
import { ErrorService, JwtSchema } from "../../@types/types"
import retrieveJwt from "../../../utils/retrieveJwt"

export default class ChangeUserProfileController {
  async handle(req: Request, res: Response) {
    const infosToUpdate = req.body
    const token = req.cookies["voucher-token"]

    const { data: decodedToken } = retrieveJwt(token) as JwtSchema

    const factory = new UserControllerFactory()
    const { changeUserProfileService } = factory.handle()

    try {
      await changeUserProfileService.execute({
        userEmail: decodedToken.email,
        userId: decodedToken.id,
        infosToUpdate,
      })

      return res.status(200).send({ message: "Profile updated." })
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
