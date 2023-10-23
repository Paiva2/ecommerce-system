import { Store } from "../../@types/types"
import { StoreRepository } from "../../repositories/StoreRepository"

interface GetAllStoreServiceResponse {
  stores: Store[]
}

export default class GetAllStoresService {
  constructor(private storeRepository: StoreRepository) {}

  async execute(): Promise<GetAllStoreServiceResponse> {
    const stores = await this.storeRepository.getAllStores()

    return { stores }
  }
}
