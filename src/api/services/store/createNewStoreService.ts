import { Store } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface CreateNewStoreServiceRequest {
  storeName: string
  storeDescription?: string
  storeOwner: string
  storeCoin: string
}
interface CreateNewStoreServiceResponse {
  store: Store
}

export default class CreateNewStoreService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private storeCoinRepository: StoreCoinRepository
  ) {}

  async execute({
    storeName,
    storeOwner,
    storeDescription,
    storeCoin,
  }: CreateNewStoreServiceRequest): Promise<CreateNewStoreServiceResponse> {
    if (!storeName || !storeOwner || !storeCoin) {
      throw {
        status: 403,
        error: "You must provide all informations. Store name and store owner.",
      }
    }

    const checkIfUserExists = await this.userRepository.findByEmail(storeOwner)

    if (!checkIfUserExists) {
      throw {
        status: 404,
        error: "Store owner not found (e-mail).",
      }
    }

    const doesUserAlreadyHasAnStore = await this.storeRepository.findUserStore(
      storeOwner
    )

    if (doesUserAlreadyHasAnStore) {
      throw {
        status: 403,
        error: "User already has an store.",
      }
    }

    const createdStore = await this.storeRepository.create(
      storeOwner,
      storeName,
      storeDescription
    )

    const newStoreCoin = await this.storeCoinRepository.insert(
      storeCoin,
      createdStore.id
    )

    const store = {
      ...createdStore,
      store_coin: newStoreCoin,
    }

    return { store }
  }
}
