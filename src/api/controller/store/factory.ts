import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import CreateNewStoreService from "../../services/store/createNewStoreService"

export default class StoreControllerFactory {
  handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const createNewStoreService = new CreateNewStoreService(
      storeRepository,
      userRepository
    )

    return { createNewStoreService }
  }
}
