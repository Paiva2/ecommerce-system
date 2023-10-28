import { Store } from "../../@types/types"
import { StoreRepository } from "../../repositories/StoreRepository"

interface ChangeStoreInformationsServiceRequest {
  storeOwner: string
  storeUpdate: {
    storeId: string
    description?: string
    name?: string
  }
}

export default class ChangeStoreInformationsService {
  constructor(private storeRepository: StoreRepository) {}

  async execute({
    storeOwner,
    storeUpdate,
  }: ChangeStoreInformationsServiceRequest): Promise<Store> {
    if (!storeOwner) {
      throw {
        status: 403,
        error: "Invalid user e-mail.",
      }
    } else if (!storeUpdate.storeId) {
      throw {
        status: 403,
        error: "Invalid store id.",
      }
    }

    const doesStoreExists = await this.storeRepository.findUniqueById(
      storeUpdate.storeId
    )

    if (!doesStoreExists) {
      throw {
        status: 404,
        error: "Store id not found.",
      }
    }

    if (doesStoreExists.storeOwner !== storeOwner) {
      throw {
        status: 403,
        error: "Invalid store owner.",
      }
    }

    if (!storeUpdate.description && !storeUpdate.name) {
      return doesStoreExists
    }

    const updatedStore = await this.storeRepository.update(storeUpdate)

    return updatedStore
  }
}
