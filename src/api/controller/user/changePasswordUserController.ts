import { Request, Response } from "express"
import ChangePasswordUserService from "../../services/user/changePasswordUserService"
import PgUser from "../../database/pgUser"
import { ErrorService } from "../../@types/types"

export default class ChangePasswordUserController {
  async handle(request: Request, response: Response) {
    const { email, newPassword } = request.body

    const userRepository = new PgUser()
    const changePasswordUserService = new ChangePasswordUserService(userRepository)

    try {
      await changePasswordUserService.execute({
        email,
        newPassword,
      })

      return response.status(200).send()
    } catch (e) {
      const err = e as ErrorService

      return response.status(err.status).send({ message: err.error })
    }
  }
}
