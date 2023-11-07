import { StoreItem, UpdateStoreItem } from "../../@types/types"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface ChangeStoreItemInformationsRequest {
  userId: string
  itemId: string
  informationsToUpdate: UpdateStoreItem
}

interface ChangeStoreItemInformationsResponse {
  updatedItem?: StoreItem
  checkIfItemExists?: StoreItem
}

export default class ChangeStoreItemInformationsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeItemRepository: StoreItemRepository
  ) {}

  async execute({
    userId,
    itemId,
    informationsToUpdate,
  }: ChangeStoreItemInformationsRequest): Promise<ChangeStoreItemInformationsResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid userId.",
      }
    } else if (!itemId) {
      throw {
        status: 403,
        error: "Invalid itemId.",
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

    const checkIfItemExists = await this.storeItemRepository.findStoreItem(
      getStore.id,
      itemId
    )

    if (!checkIfItemExists) {
      throw {
        status: 404,
        error: "Item not found.",
      }
    }

    if (!Object.keys(informationsToUpdate).length) {
      return { checkIfItemExists }
    }

    const updatedItem = await this.storeItemRepository.updateItemInformations(
      itemId,
      getStore.id,
      informationsToUpdate
    )

    return { updatedItem }
  }
}
