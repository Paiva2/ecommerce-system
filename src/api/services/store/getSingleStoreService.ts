import { Store } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"

interface GetSingleStoreServiceRequest {
  storeId: string
}

interface GetSingleStoreServiceResponse {
  store: Store
}

export default class GetSingleStoreService {
  constructor(
    private storeRepository: StoreRepository,
    private storeCoinRepository: StoreCoinRepository,
    private storeItemRepository: StoreItemRepository
  ) {}

  async execute({
    storeId,
  }: GetSingleStoreServiceRequest): Promise<GetSingleStoreServiceResponse> {
    if (!storeId) {
      throw {
        status: 403,
        error: "Invalid store id.",
      }
    }

    const getStore = await this.storeRepository.findUniqueById(storeId)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const getStoreCoin = await this.storeCoinRepository.findStoreCoin(getStore.id)

    const getStoreItems = await this.storeItemRepository.findStoreItems(
      getStore.id,
      getStoreCoin.store_coin_name
    )

    const store = {
      ...getStore,
      store_coin: getStoreCoin,
      store_item: getStoreItems,
    }

    return { store }
  }
}
