import { Express } from "express"
import RegisterNewUserController from "../controller/user/registerNewUserController"

const registerNewUserController = new RegisterNewUserController()

export default function userRoutes(app: Express) {
  app.post("/register", registerNewUserController.handle)
}
