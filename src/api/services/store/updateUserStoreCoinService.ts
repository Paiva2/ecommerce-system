import { UserCoin } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"

interface UpdateUserStoreCoinServiceRequest {
  storeOwnerEmail: string
  newValue: number
  userToUpdate: string
}

interface UpdateUserStoreCoinServiceResponse {
  userCoinUpdated: UserCoin
}

export default class UpdateUserStoreCoinService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private storeCoinRepository: StoreCoinRepository,
    private userCoinRepository: UserCoinRepository,
    private walletRepository: WalletRepository
  ) {}

  async execute({
    newValue,
    storeOwnerEmail,
    userToUpdate,
  }: UpdateUserStoreCoinServiceRequest): Promise<UpdateUserStoreCoinServiceResponse> {
    if (!storeOwnerEmail) {
      throw {
        status: 403,
        error: "You must provide an valid store id.",
      }
    }

    const getStore = await this.storeRepository.findUserStore(storeOwnerEmail)

    const getUser = await this.userRepository.findByEmail(userToUpdate)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    } else if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const { store_coin_name: storeCoinName } =
      await this.storeCoinRepository.findStoreCoin(getStore.id)

    const wallet = await this.walletRepository.findUserWallet(getUser.id)

    const getUserCoins = await this.userCoinRepository.findUserCoins(wallet.id)

    const checkIfUserHasThisCoin = getUserCoins.some(
      (coin) => coin.coin_name === storeCoinName && coin.fkcoin_owner === wallet.id
    )

    if (!checkIfUserHasThisCoin) {
      throw {
        status: 404,
        error: "User hasn't this coin, insert some value before update.",
      }
    }

    const userCoinUpdated = await this.userCoinRepository.updateFullValue(
      newValue,
      wallet.id,
      storeCoinName
    )

    return { userCoinUpdated }
  }
}
