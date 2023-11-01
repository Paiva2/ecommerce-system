import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"
import GetAllStoresController from "../controller/store/getAllStoresController"
import ChangeStoreInformationsController from "../controller/store/changeStoreInformationsController"
import GiveUserStoreCoinController from "../controller/store/giveUserStoreCoinController"
import UpdateUserStoreCoinController from "../controller/store/updateUserStoreCoinController"
import dtoValidation from "../middleware/dtoValidation"
import {
  ChangeStoreInformationsDTO,
  CreateNewStoreDTO,
  GiveUserStoreCoinDTO,
  UpdateUserStoreCoinDTO,
} from "../dto/store/storeDTO"
import AddNewItemToStoreListController from "../controller/store/addNewItemToStoreListController"

import multer from "multer"

const upload = multer({ dest: "uploads/" })

export default function storeRoutes(app: Express) {
  app.post(
    "/store",
    [jwtCheck, dtoValidation(CreateNewStoreDTO)],
    CreateNewStoreController.handle
  )

  app.get("/store", GetAllStoresController.handle)

  app.patch(
    "/store",
    [jwtCheck, dtoValidation(ChangeStoreInformationsDTO)],
    ChangeStoreInformationsController.handle
  )

  app.post(
    "/store-coin",
    [jwtCheck, dtoValidation(GiveUserStoreCoinDTO)],
    GiveUserStoreCoinController.handle
  )

  app.patch(
    "/store-coin",
    [jwtCheck, dtoValidation(UpdateUserStoreCoinDTO)],
    UpdateUserStoreCoinController.handle
  )

  app.post("/store-item", [jwtCheck], AddNewItemToStoreListController.handle)
}
