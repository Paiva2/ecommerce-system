import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"
import GetAllStoresController from "../controller/store/getAllStoresController"
import ChangeStoreInformationsController from "../controller/store/changeStoreInformationsController"

const createNewStoreController = new CreateNewStoreController()
const getAllStoresController = new GetAllStoresController()
const changeStoreInformationsController = new ChangeStoreInformationsController()

export default function storeRoutes(app: Express) {
  app.post("/store", [jwtCheck], createNewStoreController.handle)

  app.get("/store", getAllStoresController.handle)

  app.patch("/store", [jwtCheck], changeStoreInformationsController.handle)
}
