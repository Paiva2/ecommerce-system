import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"

const createNewStoreController = new CreateNewStoreController()

export default function storeRoutes(app: Express) {
  app.post("/store", [jwtCheck], createNewStoreController.handle)
}
