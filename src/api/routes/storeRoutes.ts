import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"
import GetAllStoresController from "../controller/store/getAllStoresController"

const createNewStoreController = new CreateNewStoreController()
const getAllStoresController = new GetAllStoresController()

export default function storeRoutes(app: Express) {
  app.post("/store", [jwtCheck], createNewStoreController.handle)

  app.get("/store", getAllStoresController.handle)
}
