import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import AuthenticateUserService from "../../services/user/authenticateUserService"
import ChangePasswordUserService from "../../services/user/changePasswordUserService"
import ChangeUserProfileService from "../../services/user/changeUserProfileService"
import GetUserProfileService from "../../services/user/getUserProfileService"
import RegisterNewUserServices from "../../services/user/registerNewUserService"

export default class UserControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()

    const changeUserProfileService = new ChangeUserProfileService(userRepository)

    const getUserProfileService = new GetUserProfileService(
      userRepository,
      storeRepository
    )

    const registerNewUserService = new RegisterNewUserServices(userRepository)

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
