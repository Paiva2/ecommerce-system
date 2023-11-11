import PgStore from "../../database/pgStore"
import PgStoreCoin from "../../database/pgStoreCoin"
import PgStoreCoupon from "../../database/pgStoreCoupon"
import PgStoreItem from "../../database/pgStoreItem"
import PgUser from "../../database/pgUser"
import PgUserCoin from "../../database/pgUserCoin"
import PgUserItem from "../../database/pgUserItem"
import PgUserWishList from "../../database/pgUserWishList"
import PgWallet from "../../database/pgWallet"
import PgWishListItem from "../../database/pgWishListItem"
import AuthenticateUserService from "../../services/user/authenticateUserService"
import ChangePasswordUserService from "../../services/user/changePasswordUserService"
import ChangeUserProfileService from "../../services/user/changeUserProfileService"
import GetUserProfileService from "../../services/user/getUserProfileService"
import GetUserWishListService from "../../services/user/getUserWishListService"
import InsertItemToWishListService from "../../services/user/insertItemToWishListService"
import ListAllUserStoreCouponsService from "../../services/user/listAllUserStoreCoupons"
import RegisterNewUserServices from "../../services/user/registerNewUserService"
import RemoveItemFromWishListService from "../../services/user/removeItemFromWishListService"
import RemoveStoreItemFromListService from "../../services/user/removeStoreItemFromListService"

export default class UserControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const walletRepository = new PgWallet()
    const userCoinRepository = new PgUserCoin()
    const storeCoinRepository = new PgStoreCoin()
    const userItemRepository = new PgUserItem()
    const storeCouponRepository = new PgStoreCoupon()
    const userWishListRepository = new PgUserWishList()
    const storeItemRepository = new PgStoreItem()
    const wishListItemRepository = new PgWishListItem()

    const removeStoreItemfromListService = new RemoveStoreItemFromListService(
      userRepository,
      storeRepository,
      storeItemRepository
    )

    const removeItemFromWishListService = new RemoveItemFromWishListService(
      userRepository,
      userWishListRepository,
      wishListItemRepository
    )

    const getUserWishlistService = new GetUserWishListService(
      userRepository,
      userWishListRepository,
      wishListItemRepository
    )

    const insertItemToWishListService = new InsertItemToWishListService(
      userRepository,
      userWishListRepository,
      storeItemRepository,
      wishListItemRepository
    )

    const listAllUserStoreCouponsService = new ListAllUserStoreCouponsService(
      userRepository,
      storeRepository,
      storeCouponRepository
    )

    const changeUserProfileService = new ChangeUserProfileService(userRepository)

    const getUserProfileService = new GetUserProfileService(
      userRepository,
      storeRepository,
      storeCoinRepository,
      walletRepository,
      userCoinRepository,
      userItemRepository,
      storeCouponRepository,
      userWishListRepository
    )

    const registerNewUserService = new RegisterNewUserServices(
      userRepository,
      walletRepository,
      userWishListRepository
    )

    const changePasswordUserService = new ChangePasswordUserService(userRepository)

    const authenticateUserService = new AuthenticateUserService(userRepository)

    return {
      removeStoreItemfromListService,
      removeItemFromWishListService,
      getUserWishlistService,
      insertItemToWishListService,
      listAllUserStoreCouponsService,
      getUserProfileService,
      registerNewUserService,
      changePasswordUserService,
      authenticateUserService,
      changeUserProfileService,
    }
  }
}
