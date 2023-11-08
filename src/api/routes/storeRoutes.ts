import { Express } from "express"
import CreateNewStoreController from "../controller/store/createNewStoreController"
import jwtCheck from "../middleware/jwtCheck"
import GetAllStoresController from "../controller/store/getAllStoresController"
import ChangeStoreInformationsController from "../controller/store/changeStoreInformationsController"
import GiveUserStoreCoinController from "../controller/store/giveUserStoreCoinController"
import UpdateUserStoreCoinController from "../controller/store/updateUserStoreCoinController"
import dtoValidation from "../middleware/dtoValidation"
import {
  AddNewItemToStoreListDTO,
  ChangeStoreInformationsDTO,
  ChangeStoreItemInformationsControllerDTO,
  CreateNewStoreDTO,
  GiveUserStoreCoinDTO,
  UpdateUserStoreCoinDTO,
} from "../dto/store/storeDTO"
import AddNewItemToStoreListController from "../controller/store/addNewItemToStoreListController"

import GetSingleStoreController from "../controller/store/getSingleStoreController"
import GetStoreItemListController from "../controller/store/getStoreItemListController"
import GetStoreItemController from "../controller/store/getStoreItemController"
import UserPurchaseItemController from "../controller/user/userPurchaseItemController"
import { UserPurchaseItemControllerDTO } from "../dto/user/userDTO"
import ChangeStoreItemInformationsController from "../controller/store/changeStoreItemInformationsController"

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

  app.post(
    "/store-item",
    [jwtCheck, dtoValidation(AddNewItemToStoreListDTO)],
    AddNewItemToStoreListController.handle
  )

  app.patch(
    "/store-item",
    [jwtCheck, dtoValidation(ChangeStoreItemInformationsControllerDTO)],
    ChangeStoreItemInformationsController.handle
  )

  app.get("/item", GetStoreItemController.handle)

  app.get("/store/:storeId", GetSingleStoreController.handle)

  app.get("/list/:storeId", GetStoreItemListController.handle)

  app.post(
    "/checkout/store-item",
    [jwtCheck, dtoValidation(UserPurchaseItemControllerDTO)],
    UserPurchaseItemController.handle
  )
}
