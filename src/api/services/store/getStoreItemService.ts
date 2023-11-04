import { StoreItem } from "../../@types/types"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"

interface GetStoreItemServiceRequest {
  storeId: string
  itemId: string
}

interface GetStoreItemServiceResponse {
  storeItem: {
    storeName: string
    storeOwner: string
    storeCoin: string
    storeItem: StoreItem
  }
}

export default class GetStoreItemService {
  constructor(
    private storeItemRepository: StoreItemRepository,
    private storeRepository: StoreRepository
  ) {}

  async execute({
    itemId,
    storeId,
  }: GetStoreItemServiceRequest): Promise<GetStoreItemServiceResponse> {
    if (!storeId) {
      throw {
        status: 403,
        error: "Invalid store id.",
      }
    }

    if (!itemId) {
      throw {
        status: 403,
        error: "Invalid item id.",
      }
    }

    const getStore = await this.storeRepository.findUniqueById(storeId)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store id not found.",
      }
    }

    const item = await this.storeItemRepository.findStoreItem(storeId, itemId)

    if (!item) {
      throw {
        status: 404,
        error: "Item id not found.",
      }
    }

    const storeItem = {
      storeName: getStore.name,
      storeOwner: getStore.storeOwner,
      storeCoin: item.fkstore_coin,
      storeItem: item,
    }

    return { storeItem }
  }
}
