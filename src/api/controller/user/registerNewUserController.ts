import { Request, Response } from "express"
import RegisterNewUserServices from "../../services/user/registerNewUserService"
import PgUser from "../../database/pgUser"
import { ErrorService } from "../../@types/types"

export default class RegisterNewUserController {
  async handle(request: Request, response: Response) {
    const { username, password, email } = request.body

    const userRepository = new PgUser()
    const registerNewUserService = new RegisterNewUserServices(userRepository)

    try {
      await registerNewUserService.execute({
        email,
        password,
        username,
      })

      return response.status(201).send()
    } catch (e) {
      const err = e as ErrorService

      return response.status(err.status).send({ message: err.error })
    }
  }
}
