import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"
import GetAllStoresController from "../controller/store/getAllStoresController"
import ChangeStoreInformationsController from "../controller/store/changeStoreInformationsController"
import GiveUserStoreCoinController from "../controller/store/giveUserStoreCoinController"
import UpdateUserStoreCoinController from "../controller/store/updateUserStoreCoinController"

const createNewStoreController = new CreateNewStoreController()
const getAllStoresController = new GetAllStoresController()
const changeStoreInformationsController = new ChangeStoreInformationsController()
const giveUserStoreCoinController = new GiveUserStoreCoinController()
const updateUserStoreCoinController = new UpdateUserStoreCoinController()

export default function storeRoutes(app: Express) {
  app.post("/store", [jwtCheck], createNewStoreController.handle)

  app.get("/store", getAllStoresController.handle)

  app.patch("/store", [jwtCheck], changeStoreInformationsController.handle)

  app.post("/store-coin", [jwtCheck], giveUserStoreCoinController.handle)

  app.patch("/store-coin", [jwtCheck], updateUserStoreCoinController.handle)
}
