import { Express } from "express"
import RegisterNewUserController from "../controller/user/registerNewUserController"
import ChangePasswordUserController from "../controller/user/changePasswordUserController"
import AuthenticateUserController from "../controller/user/authenticateUserController"
import GetUserProfileController from "../controller/user/getUserProfileController"
import jwtCheck from "../middleware/jwtCheck"
import ChangeUserProfileController from "../controller/user/changeUserProfileController"

const registerNewUserController = new RegisterNewUserController()
const changePasswordUserController = new ChangePasswordUserController()
const authenticateUserController = new AuthenticateUserController()
const getUserProfileController = new GetUserProfileController()
const changeUserProfileController = new ChangeUserProfileController()

export default function userRoutes(app: Express) {
  app.post("/register", registerNewUserController.handle)

  app.patch("/new-password", changePasswordUserController.handle)

  app.post("/login", authenticateUserController.handle)

  app.get("/profile", [jwtCheck], getUserProfileController.handle)

  app.patch("/profile", [jwtCheck], changeUserProfileController.handle)
}
