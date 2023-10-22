import { Store, User } from "../../@types/types"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface GetUserProfileServiceRequest {
  userEmail: string
}

interface GetUserProfileServiceResponse {
  user: User
}

export default class GetUserProfileService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository
  ) {}

  async execute({
    userEmail,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    if (!userEmail) {
      throw {
        status: 403,
        error: "You must provide user an valid user email.",
      }
    }

    const findUser = await this.userRepository.findByEmail(userEmail)

    if (!findUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const store = await this.storeRepository.findUserStore(userEmail)

    const user = {
      ...findUser,
      store: store ? store : ({} as Store),
    }

    return { user }
  }
}
