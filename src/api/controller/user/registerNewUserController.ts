import { Request, Response } from "express"
import { ErrorService } from "../../@types/types"
import UserControllerFactory from "./factory"

export default class RegisterNewUserController {
  static async handle(request: Request, response: Response) {
    const { username, password, email } = request.body

    const { registerNewUserService } = UserControllerFactory.handle()

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
