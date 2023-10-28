import { UserCoin } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"

interface GiveUserStoreCoinServiceRequest {
  storeId: string
  valueToGive: number
  userToReceive: string
}

export default class GiveUserStoreCoinService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private userCoinRepository: UserCoinRepository,
    private walletRepository: WalletRepository,
    private storeCoinRepository: StoreCoinRepository
  ) {}

  async execute({
    storeId,
    userToReceive,
    valueToGive,
  }: GiveUserStoreCoinServiceRequest) {
    if (!storeId) {
      throw {
        status: 403,
        error: "You must provide an valid store id.",
      }
    } else if (!valueToGive || valueToGive < 1) {
      throw {
        status: 409,
        error: "You must provide an valid value.",
      }
    }

    const getUser = await this.userRepository.findByEmail(userToReceive)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getUserWallet = await this.walletRepository.findUserWallet(getUser.id)

    const getUserCoins = await this.userCoinRepository.findUserCoins(
      getUserWallet.id
    )

    const getStore = await this.storeRepository.findUserStore(storeId)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const getStoreCoin = await this.storeCoinRepository.findStoreCoin(getStore.id)

    const userAlreadyHasThisCoin = getUserCoins.some(
      (coin) => coin.coin_name === getStoreCoin.store_coin_name
    )

    let storeCoin = {} as UserCoin

    switch (userAlreadyHasThisCoin) {
      case false:
        storeCoin = await this.userCoinRepository.insert(
          valueToGive,
          getStoreCoin.store_coin_name,
          getUserWallet.id
        )

        break

      case true:
        storeCoin = await this.userCoinRepository.addition(
          valueToGive,
          getStoreCoin.store_coin_name,
          getUserWallet.id
        )

        break

      default:
        throw {
          status: 500,
          error: "Operation error.",
        }
    }

    return storeCoin
  }
}
