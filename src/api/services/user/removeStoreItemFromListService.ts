import { StoreItem } from "../../@types/types"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface RemoveStoreItemFromListServiceRequest {
  userId: string
  itemId: string
}

interface RemoveStoreItemFromListServiceResponse {
  updatedStoreItems: StoreItem[]
}

export default class RemoveStoreItemFromListService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeItemRepository: StoreItemRepository
  ) {}

  async execute({
    userId,
    itemId,
  }: RemoveStoreItemFromListServiceRequest): Promise<RemoveStoreItemFromListServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    }

    const getUser = await this.userRepository.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getStore = await this.storeRepository.findUserStore(getUser.email)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const updatedStoreItems = await this.storeItemRepository.removeFromList(
      getStore.id,
      itemId
    )

    return { updatedStoreItems }
  }
}
