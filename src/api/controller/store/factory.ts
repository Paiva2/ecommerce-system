import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import GetAllStoresService from "../../services/store/getAllStoresService"

export default class StoreControllerFactory {
  handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()

    const getAllStoresService = new GetAllStoresService(storeRepository)
    const createNewStoreService = new CreateNewStoreService(
      storeRepository,
      userRepository
    )

    return { createNewStoreService, getAllStoresService }
  }
}
