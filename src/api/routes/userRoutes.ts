import { Express } from "express"
import RegisterNewUserController from "../controller/user/registerNewUserController"
import ChangePasswordUserController from "../controller/user/changePasswordUserController"

const registerNewUserController = new RegisterNewUserController()
const changePasswordUserController = new ChangePasswordUserController()

export default function userRoutes(app: Express) {
  app.post("/register", registerNewUserController.handle)

  app.patch("/new-password", changePasswordUserController.handle)
}
