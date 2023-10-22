import { Store } from "../../@types/types"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface CreateNewStoreServiceRequest {
  storeName: string
  storeOwner: string
}
interface CreateNewStoreServiceResponse {
  store: Store
}

export default class CreateNewStoreService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    storeName,
    storeOwner,
  }: CreateNewStoreServiceRequest): Promise<CreateNewStoreServiceResponse> {
    if (!storeName || !storeOwner) {
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

    const store = await this.storeRepository.create(storeOwner, storeName)

    return { store }
  }
}
