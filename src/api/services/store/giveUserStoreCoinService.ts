import { UserCoin } from "../../@types/types"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface GiveUserStoreCoinServiceRequest {
  storeId: string
  valueToGive: number
  userToReceive: string
}

export default class GiveUserStoreCoinService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private userCoinRepository: UserCoinRepository
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

    const getStore = await this.storeRepository.findUserStore(storeId)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    console.log(getUser)

    const userAlreadyHasThisCoin = getUser.wallet.coins.some(
      (coin) => coin.coin_name === getStore.store_coin.store_coin_name
    )

    let storeCoin = {} as UserCoin

    switch (userAlreadyHasThisCoin) {
      case false:
        storeCoin = await this.userCoinRepository.insert(
          valueToGive,
          getStore.store_coin.store_coin_name,
          getUser.wallet.id
        )

        break

      case true:
        storeCoin = await this.userCoinRepository.addition(
          valueToGive,
          getStore.store_coin.store_coin_name,
          getUser.wallet.id
        )

        break

      default:
        throw {
          status: 500,
          error: "Operation error.",
        }
    }

    console.log(getUser.wallet.coins, storeCoin)

    return storeCoin
  }
}
