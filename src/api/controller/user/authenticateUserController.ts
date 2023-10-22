import { Request, Response } from "express"
import { ErrorService } from "../../@types/types"
import jwt from "jsonwebtoken"
import "dotenv/config"
import UserControllerFactory from "./factory"

export default class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const factory = new UserControllerFactory()
    const authenticateUserService = factory.makeAuthenticateUserFactory()

    try {
      const { isThisUserRegistered: userAuth } =
        await authenticateUserService.execute({
          email,
          password,
        })

      const tokenExp = 60 * 60 * 60 * 24 * 7 // 7d

      const generateToken = jwt.sign(
        {
          data: {
            id: userAuth.id,
            email: userAuth.email,
            role: "user",
          },
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "7d" }
      )

      return res
        .status(200)
        .setHeader(
          "Set-Cookie",
          `voucher-token=${generateToken}; HttpOnly; Path=/; Max-Age=${tokenExp}; Secure=True;`
        )
        .send()
    } catch (e) {
      const err = e as ErrorService

      return res.status(err.status).send({ message: err.error })
    }
  }
}
