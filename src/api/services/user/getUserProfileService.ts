import { Store, User } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserItemRepository } from "../../repositories/UserItemRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"

interface GetUserProfileServiceRequest {
  userEmail: string
}

interface GetUserProfileServiceResponse {
  user: User
}

export default class GetUserProfileService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeCoinRepository: StoreCoinRepository,
    private walletRepository: WalletRepository,
    private userCoinRepository: UserCoinRepository,
    private userItemRepository: UserItemRepository
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

    delete findUser.password

    const store = await this.storeRepository.findUserStore(userEmail)

    const storeCoin = await this.storeCoinRepository.findStoreCoin(store?.id)

    const userWallet = await this.walletRepository.findUserWallet(findUser.id)

    const walletCoins = await this.userCoinRepository.findUserCoins(userWallet.id)

    const userItems = await this.userItemRepository.findUserItems(findUser.id)

    const user = {
      ...findUser,
      store: store
        ? {
            ...store,
            store_coin: storeCoin,
          }
        : ({} as Store),
      wallet: {
        ...userWallet,
        coins: walletCoins,
      },
      userItems: userItems,
    }

    return { user }
  }
}
