import { Store } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"

interface GetAllStoreServiceResponse {
  formattedStores: Store[]
}

export default class GetAllStoresService {
  constructor(
    private storeRepository: StoreRepository,
    private storeCoinRepository: StoreCoinRepository
  ) {}

  async execute(): Promise<GetAllStoreServiceResponse> {
    const formattedStores = []

    const stores = await this.storeRepository.getAllStores()

    const storeCoins = await this.storeCoinRepository.getAll()

    for (let store of stores) {
      for (let storeCoin of storeCoins) {
        if (store.id === storeCoin.fkstore_coin_owner) {
          store = {
            ...store,
            store_coin: storeCoin,
          }

          formattedStores.push(store)
        }
      }
    }

    return { formattedStores }
  }
}
