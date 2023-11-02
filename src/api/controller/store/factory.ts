import PgStore from "../../database/pgStore"
import PgStoreCoin from "../../database/pgStoreCoin"
import PgStoreItem from "../../database/pgStoreItem"
import PgUser from "../../database/pgUser"
import PgUserCoin from "../../database/pgUserCoin"
import PgWallet from "../../database/pgWallet"
import { UserRepository } from "../../repositories/UserRepository"
import AddNewItemToStoreListService from "../../services/store/addNewItemToStoreListService"
import ChangeStoreInformationsService from "../../services/store/changeStoreInformationsService"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import GetAllStoresService from "../../services/store/getAllStoresService"
import GetSingleStoreService from "../../services/store/getSingleStoreService"
import GiveUserStoreCoinService from "../../services/store/giveUserStoreCoinService"
import UpdateUserStoreCoinService from "../../services/store/updateUserStoreCoinService"

export default class StoreControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const userCoinRepository = new PgUserCoin()
    const storeCoinRepository = new PgStoreCoin()
    const walletRepository = new PgWallet()
    const storeItemRepository = new PgStoreItem()

    const getSingleStoreService = new GetSingleStoreService(
      storeRepository,
      storeCoinRepository,
      storeItemRepository
    )

    const addNewItemToStoreListService = new AddNewItemToStoreListService(
      storeRepository,
      storeItemRepository,
      storeCoinRepository
    )

    const updateUserStoreCoinService = new UpdateUserStoreCoinService(
      storeRepository,
      userRepository,
      storeCoinRepository,
      userCoinRepository,
      walletRepository
    )

    const giveUserStoreCoinService = new GiveUserStoreCoinService(
      storeRepository,
      userRepository,
      userCoinRepository,
      walletRepository,
      storeCoinRepository
    )

    const changeStoreInformationsService = new ChangeStoreInformationsService(
      storeRepository
    )

    const getAllStoresService = new GetAllStoresService(
      storeRepository,
      storeCoinRepository
    )

    const createNewStoreService = new CreateNewStoreService(
      storeRepository,
      userRepository,
      storeCoinRepository
    )

    return {
      createNewStoreService,
      getSingleStoreService,
      getAllStoresService,
      addNewItemToStoreListService,
      changeStoreInformationsService,
      giveUserStoreCoinService,
      updateUserStoreCoinService,
    }
  }
}
