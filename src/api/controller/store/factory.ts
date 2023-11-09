import PgStore from "../../database/pgStore"
import PgStoreCoin from "../../database/pgStoreCoin"
import PgStoreCoupon from "../../database/pgStoreCoupon"
import PgStoreItem from "../../database/pgStoreItem"
import PgUser from "../../database/pgUser"
import PgUserCoin from "../../database/pgUserCoin"
import PgUserItem from "../../database/pgUserItem"
import PgWallet from "../../database/pgWallet"
import AddNewItemToStoreListService from "../../services/store/addNewItemToStoreListService"
import ChangeStoreInformationsService from "../../services/store/changeStoreInformationsService"
import ChangeStoreItemInformationsService from "../../services/store/changeStoreItemInformationsService"
import CreateCouponStoreService from "../../services/store/createCouponStoreService"
import CreateNewStoreService from "../../services/store/createNewStoreService"
import GetAllStoresService from "../../services/store/getAllStoresService"
import GetSingleStoreService from "../../services/store/getSingleStoreService"
import GetStoreItemListService from "../../services/store/getStoreItemListService"
import GetStoreItemService from "../../services/store/getStoreItemService"
import GiveUserStoreCoinService from "../../services/store/giveUserStoreCoinService"
import UpdateUserStoreCoinService from "../../services/store/updateUserStoreCoinService"
import UserPurchaseItemService from "../../services/user/userPurchaseItemService"

export default class StoreControllerFactory {
  public static handle() {
    const userRepository = new PgUser()
    const storeRepository = new PgStore()
    const userCoinRepository = new PgUserCoin()
    const storeCoinRepository = new PgStoreCoin()
    const walletRepository = new PgWallet()
    const storeItemRepository = new PgStoreItem()
    const userItemRepository = new PgUserItem()
    const storeCouponRepository = new PgStoreCoupon()

    const createCouponStoreService = new CreateCouponStoreService(
      userRepository,
      storeRepository,
      storeCouponRepository
    )

    const changeStoreItemInformationsService =
      new ChangeStoreItemInformationsService(
        userRepository,
        storeRepository,
        storeItemRepository
      )

    const userPurchaseItemService = new UserPurchaseItemService(
      userRepository,
      walletRepository,
      userItemRepository,
      userCoinRepository,
      storeRepository,
      storeItemRepository,
      storeCoinRepository
    )

    const getStoreItemService = new GetStoreItemService(
      storeItemRepository,
      storeRepository
    )

    const getStoreItemListService = new GetStoreItemListService(
      storeItemRepository,
      storeCoinRepository
    )

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
      createCouponStoreService,
      changeStoreItemInformationsService,
      userPurchaseItemService,
      getStoreItemService,
      createNewStoreService,
      getSingleStoreService,
      getAllStoresService,
      getStoreItemListService,
      addNewItemToStoreListService,
      changeStoreInformationsService,
      giveUserStoreCoinService,
      updateUserStoreCoinService,
    }
  }
}
