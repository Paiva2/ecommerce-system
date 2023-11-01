import {
  StoreItem,
  StoreItemInsert,
  StoreItemRequestPayload,
} from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"

interface AddNewItemToStoreListServiceRequest {
  userEmail: string
  itemList: StoreItemRequestPayload[]
}

interface AddNewItemToStoreListServiceResponse {
  newItemListCreation: StoreItem[]
}

export default class AddNewItemToStoreListService {
  constructor(
    private storeRepository: StoreRepository,
    private storeItemRepository: StoreItemRepository,
    private storeCoinRepository: StoreCoinRepository
  ) {}

  async handle({
    userEmail,
    itemList,
  }: AddNewItemToStoreListServiceRequest): Promise<AddNewItemToStoreListServiceResponse> {
    if (!userEmail) {
      throw {
        status: 403,
        error: "Invalid user e-mail.",
      }
    }

    const getUserStore = await this.storeRepository.findUserStore(userEmail)

    if (!getUserStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const getStoreCoin = await this.storeCoinRepository.findStoreCoin(
      getUserStore.id
    )

    const formatItemList = [] as StoreItemInsert[]

    for (let item of itemList) {
      formatItemList.push({
        ...item,
        storeId: getUserStore.id,
        storeCoin: getStoreCoin.store_coin_name,
      })
    }

    const newItemListCreation = await this.storeItemRepository.insert(formatItemList)

    return { newItemListCreation }
  }
}
