import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import ChangeStoreInformationsService from "../../services/store/changeStoreInformationsService"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import GetAllStoresService from "../../services/store/getAllStoresService"

export default class StoreControllerFactory {
  handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()

    const changeStoreInformationsService = new ChangeStoreInformationsService(
      storeRepository
    )
    const getAllStoresService = new GetAllStoresService(storeRepository)
    const createNewStoreService = new CreateNewStoreService(
      storeRepository,
      userRepository
    )

    return {
      createNewStoreService,
      getAllStoresService,
      changeStoreInformationsService,
    }
  }
}
