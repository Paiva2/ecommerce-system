import { Express } from "express"
import RegisterNewUserController from "../controller/user/registerNewUserController"
import ChangePasswordUserController from "../controller/user/changePasswordUserController"
import AuthenticateUserController from "../controller/user/authenticateUserController"

const registerNewUserController = new RegisterNewUserController()
const changePasswordUserController = new ChangePasswordUserController()
const authenticateUserController = new AuthenticateUserController()

export default function userRoutes(app: Express) {
  app.post("/register", registerNewUserController.handle)

  app.patch("/new-password", changePasswordUserController.handle)

  app.post("/login", authenticateUserController.handle)
}
