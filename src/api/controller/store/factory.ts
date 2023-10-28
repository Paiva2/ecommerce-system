import PgStore from "../../database/pgStore"
import PgUser from "../../database/pgUser"
import PgUserCoin from "../../database/pgUserCoin"
import { UserRepository } from "../../repositories/UserRepository"
import ChangeStoreInformationsService from "../../services/store/changeStoreInformationsService"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import GetAllStoresService from "../../services/store/getAllStoresService"
import GiveUserStoreCoinService from "../../services/store/giveUserStoreCoinService"

export default class StoreControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const userCoinRepository = new PgUserCoin()

    const giveUserStoreCoinService = new GiveUserStoreCoinService(
      storeRepository,
      userRepository,
      userCoinRepository
    )

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
      giveUserStoreCoinService,
    }
  }
}
