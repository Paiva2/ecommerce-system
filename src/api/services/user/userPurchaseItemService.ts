import { UserItem } from "../../@types/types"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserItemRepository } from "../../repositories/UserItemRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"

interface UserPurchaseItemServiceRequest {
  userId: string
  storeId: string
  itemId: string
  quantity: number
}

interface UserPurchaseItemServiceResponse {
  userItem: UserItem
}

export default class UserPurchaseItemService {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private userItemRepository: UserItemRepository,
    private userCoinRepository: UserCoinRepository,
    private storeRepository: StoreRepository,
    private storeItemRepository: StoreItemRepository
  ) {}

  async execute(
    reqParams: UserPurchaseItemServiceRequest
  ): Promise<UserPurchaseItemServiceResponse> {
    for (let param of Object.keys(reqParams)) {
      if (!reqParams[param] || reqParams[param] < 1) {
        throw {
          status: param === "quantity" ? 409 : 403,
          error: `Invalid ${param}.`,
        }
      }
    }

    const getUser = await this.userRepository.findById(reqParams.userId)

    const getStore = await this.storeRepository.findUniqueById(reqParams.storeId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const storeItem = await this.storeItemRepository.findStoreItem(
      getStore.id,
      reqParams.itemId
    )

    if (!storeItem) {
      throw {
        status: 404,
        error: "Store item not found.",
      }
    }

    const getItemValue = storeItem.promotion
      ? storeItem.promotional_value
      : storeItem.value

    const getUserWallet = await this.walletRepository.findUserWallet(getUser.id)

    const getUserCoins = await this.userCoinRepository.findUserCoinByCoinName(
      getUserWallet.id,
      storeItem.fkstore_coin
    )

    if (storeItem.quantity < reqParams.quantity) {
      throw {
        status: 409,
        error: "Item quantity unavailable.",
      }
    }

    if (getItemValue > getUserCoins.quantity) {
      throw {
        status: 409,
        error: "Invalid user balance.",
      }
    }

    await this.storeItemRepository.updateItemQuantityToUserPurchase(
      getStore.id,
      storeItem.id,
      reqParams.quantity
    )

    await this.userCoinRepository.updateUserCoinsToStoreItemPurchase(
      getUserWallet.id,
      getUserCoins.id,
      getItemValue
    )

    const userItem = await this.userItemRepository.insertUserItemToUserPurchase(
      getUser.id,
      storeItem.fkstore_coin,
      storeItem.item_name,
      getStore.name,
      reqParams.quantity,
      getItemValue
    )

    return { userItem }
  }
}
