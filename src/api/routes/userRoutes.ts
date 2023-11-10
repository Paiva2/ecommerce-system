import { Express } from "express"
import RegisterNewUserController from "../controller/user/registerNewUserController"
import ChangePasswordUserController from "../controller/user/changePasswordUserController"
import AuthenticateUserController from "../controller/user/authenticateUserController"
import GetUserProfileController from "../controller/user/getUserProfileController"
import jwtCheck from "../middleware/jwtCheck"
import ChangeUserProfileController from "../controller/user/changeUserProfileController"
import dtoValidation from "../middleware/dtoValidation"
import {
  AuthenticateUserControllerDTO,
  ChangeUserPasswordDTO,
  ChangeUserProfileDTO,
  InsertItemToWishListControllerDTO,
  RegisterNewUserDTO,
  RemoveItemFromWishListControllerDTO,
} from "../dto/user/userDTO"
import ListAllUserStoreCouponsController from "../controller/user/listAllUserStoreCouponsController"
import InsertItemToWishListController from "../controller/user/insertItemToWishListController"
import GetUserWishListController from "../controller/user/getUserWishListController"
import RemoveItemFromWishListController from "../controller/user/removeItemFronWishListController"

export default function userRoutes(app: Express) {
  app.post(
    "/register",
    [dtoValidation(RegisterNewUserDTO)],
    RegisterNewUserController.handle
  )

  app.patch(
    "/new-password",
    [dtoValidation(ChangeUserPasswordDTO)],
    ChangePasswordUserController.handle
  )

  app.post(
    "/login",
    [dtoValidation(AuthenticateUserControllerDTO)],
    AuthenticateUserController.handle
  )

  app.get("/profile", [jwtCheck], GetUserProfileController.handle)

  app.patch(
    "/profile",
    [jwtCheck, dtoValidation(ChangeUserProfileDTO)],
    ChangeUserProfileController.handle
  )

  app.get("/store-coupons", [jwtCheck], ListAllUserStoreCouponsController.handle)

  app.post(
    "/wish-list",
    [jwtCheck, dtoValidation(InsertItemToWishListControllerDTO)],
    InsertItemToWishListController.handle
  )

  app.get("/wish-list", [jwtCheck], GetUserWishListController.handle)

  app.delete(
    "/wish-list",
    [jwtCheck, dtoValidation(RemoveItemFromWishListControllerDTO)],
    RemoveItemFromWishListController.handle
  )
}
