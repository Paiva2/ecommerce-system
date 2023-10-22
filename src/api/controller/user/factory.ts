import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import AuthenticateUserService from "../../services/user/authenticateUserService"
import ChangePasswordUserService from "../../services/user/changePasswordUserService"
import GetUserProfileService from "../../services/user/getUserProfileService"
import RegisterNewUserServices from "../../services/user/registerNewUserService"

export default class UserControllerFactory {
  makeUserProfileFactory() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const getUserProfileService = new GetUserProfileService(
      userRepository,
      storeRepository
    )

    return getUserProfileService
  }

  makeRegisterNewUserFactory() {
    const userRepository = new PgUser()
    const registerNewUserService = new RegisterNewUserServices(userRepository)

    return registerNewUserService
  }

  makeChangePasswordFactory() {
    const userRepository = new PgUser()
    const changePasswordUserService = new ChangePasswordUserService(userRepository)

    return changePasswordUserService
  }

  makeAuthenticateUserFactory() {
    const userRepository = new PgUser()
    const authenticateUserService = new AuthenticateUserService(userRepository)

    return authenticateUserService
  }
}
