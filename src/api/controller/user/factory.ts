import PgStore from "../../database/pgStore"
import PgStoreCoin from "../../database/pgStoreCoin"
import PgStoreCoupon from "../../database/pgStoreCoupon"
import PgUser from "../../database/pgUser"
import PgUserCoin from "../../database/pgUserCoin"
import PgUserItem from "../../database/pgUserItem"
import PgWallet from "../../database/pgWallet"
import AuthenticateUserService from "../../services/user/authenticateUserService"
import ChangePasswordUserService from "../../services/user/changePasswordUserService"
import ChangeUserProfileService from "../../services/user/changeUserProfileService"
import GetUserProfileService from "../../services/user/getUserProfileService"
import RegisterNewUserServices from "../../services/user/registerNewUserService"

export default class UserControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const walletRepository = new PgWallet()
    const userCoinRepository = new PgUserCoin()
    const storeCoinRepository = new PgStoreCoin()
    const userItemRepository = new PgUserItem()
    const storeCouponRepository = new PgStoreCoupon()

    const changeUserProfileService = new ChangeUserProfileService(userRepository)

    const getUserProfileService = new GetUserProfileService(
      userRepository,
      storeRepository,
      storeCoinRepository,
      walletRepository,
      userCoinRepository,
      userItemRepository,
      storeCouponRepository
    )

    const registerNewUserService = new RegisterNewUserServices(
      userRepository,
      walletRepository
    )

    const changePasswordUserService = new ChangePasswordUserService(userRepository)

    const authenticateUserService = new AuthenticateUserService(userRepository)

    return {
      getUserProfileService,
      registerNewUserService,
      changePasswordUserService,
      authenticateUserService,
      changeUserProfileService,
    }
  }
}
