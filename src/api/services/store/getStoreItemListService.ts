import { StoreItem } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"

interface GetStoreItemListServiceRequest {
  storeId: string
  page: number
}

interface GetStoreItemListServiceResponse {
  storeItemList: {
    page: number
    items: StoreItem[]
  }
}

export default class GetStoreItemListService {
  constructor(
    private storeItemRepository: StoreItemRepository,
    private storeCoinRepository: StoreCoinRepository
  ) {}

  async execute({
    storeId,
    page = 1,
  }: GetStoreItemListServiceRequest): Promise<GetStoreItemListServiceResponse> {
    if (!storeId) {
      throw {
        status: 403,
        error: "Invalid store id.",
      }
    }

    const getStoreCoin = await this.storeCoinRepository.findStoreCoin(storeId)

    if (!getStoreCoin) {
      throw {
        status: 404,
        error: "Store id not found.",
      }
    }

    const findStoreList = await this.storeItemRepository.findStoreItems(
      storeId,
      getStoreCoin.store_coin_name,
      page
    )

    const storeItemList = {
      page,
      items: findStoreList,
    }

    return { storeItemList }
  }
}
