import { queue } from "../../../lib/bullMQ/queueConfig"
import { UserItem, UserItemToPurchase } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import StoreCouponRepository from "../../repositories/StoreCouponRepository"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserItemRepository } from "../../repositories/UserItemRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"
import isPast from "date-fns/isPast"

interface UserPurchaseItemServiceRequest {
  userId: string
  storeId: string
  coupon?: string
  items: Array<{
    itemId: string
    itemQuantity: number
  }>
}

interface UserPurchaseItemServiceResponse {
  userItem: UserItem[]
}

export default class UserPurchaseItemService {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private userItemRepository: UserItemRepository,
    private userCoinRepository: UserCoinRepository,
    private storeRepository: StoreRepository,
    private storeItemRepository: StoreItemRepository,
    private storeCoinRepository: StoreCoinRepository,
    private storeCouponRepository: StoreCouponRepository
  ) {}

  async execute(
    reqParams: UserPurchaseItemServiceRequest
  ): Promise<UserPurchaseItemServiceResponse> {
    if (!reqParams.storeId) {
      throw {
        status: 403,
        error: "Invalid storeId.",
      }
    } else if (!reqParams.userId) {
      throw {
        status: 403,
        error: "Invalid userId.",
      }
    } else if (!reqParams.items || !reqParams.items.length) {
      throw {
        status: 403,
        error: "Invalid item list.",
      }
    }

    const isThereAnyInvalidQuantity = reqParams.items.some(
      (item) => item.itemQuantity < 1
    )

    const isThereAnyInvalidItemId = reqParams.items.some((item) => !item.itemId)

    if (isThereAnyInvalidItemId) {
      throw {
        status: 409,
        error: "Item id can't be empty.",
      }
    }

    if (isThereAnyInvalidQuantity) {
      throw {
        status: 409,
        error: `Quantity can't be less than 1.`,
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

    const storeItems = await this.storeItemRepository.findStoreItemList(
      getStore.id,
      reqParams.items
    )

    if (!storeItems.length) {
      throw {
        status: 404,
        error: "Store item not found.",
      }
    }

    for (let storeItem of storeItems) {
      for (let desiredItem of reqParams.items) {
        if (storeItem.id === desiredItem.itemId) {
          if (
            storeItem.quantity < desiredItem.itemQuantity ||
            storeItem.quantity === 0
          ) {
            throw {
              status: 409,
              error: `Item ${storeItem.item_name} quantity unavailable.`,
            }
          }
        }
      }
    }

    const totalPurchaseValue = storeItems.reduce((acc, item) => {
      for (let reqItems of reqParams.items) {
        if (item.id === reqItems.itemId) {
          if (item.promotion) {
            acc += item.promotional_value * reqItems.itemQuantity
          } else {
            acc += item.value * reqItems.itemQuantity
          }
        }
      }

      return acc
    }, 0)

    const getUserWallet = await this.walletRepository.findUserWallet(getUser.id)

    const getStoreCoin = await this.storeCoinRepository.findStoreCoin(getStore.id)

    const getUserCoins = await this.userCoinRepository.findUserCoinByCoinName(
      getUserWallet.id,
      getStoreCoin.store_coin_name
    )

    if (!getUserCoins) {
      throw {
        status: 409,
        error: "Invalid user balance.",
      }
    }

    let purchaseTotal = totalPurchaseValue

    if (reqParams.coupon) {
      const findCoupon = await this.storeCouponRepository.findByCouponCode(
        getStore.id,
        reqParams.coupon
      )

      if (!findCoupon) {
        throw {
          status: 404,
          error: "Invalid coupon code.",
        }
      }

      if (!findCoupon.active) {
        throw {
          status: 409,
          error: "This coupon is not active.",
        }
      }

      if (isPast(findCoupon.validation_date)) {
        throw {
          status: 409,
          error: "This coupon has expired.",
        }
      }

      const getDiscount = (Number(findCoupon.discount) / 100) * totalPurchaseValue

      purchaseTotal = totalPurchaseValue - getDiscount
    }

    if (purchaseTotal > getUserCoins.quantity) {
      throw {
        status: 409,
        error: "Invalid user balance.",
      }
    }

    const NewUserItemsList = storeItems.reduce((acc: UserItemToPurchase[], item) => {
      for (let reqItems of reqParams.items) {
        if (item.id === reqItems.itemId) {
          acc.push({
            itemOwner: getUser.id,
            purchasedWith: item.fkstore_coin,
            itemName: item.item_name,
            purchasedAt: getStore.name,
            quantity: reqItems.itemQuantity,
            value: item.promotion ? item.promotional_value : item.value,
            totalValue: item.promotion
              ? item.promotional_value * reqItems.itemQuantity
              : item.value * reqItems.itemQuantity,
          })
        }
      }

      return acc
    }, [])

    await this.storeItemRepository.updateItemQuantityToUserPurchase(
      getStore.id,
      reqParams.items
    )

    await this.userCoinRepository.updateUserCoinsToStoreItemPurchase(
      getUserWallet.id,
      getUserCoins.id,
      purchaseTotal
    )

    const userItem = await this.userItemRepository.insertUserItemToUserPurchase(
      NewUserItemsList
    )

    if (process.env.NODE_ENV !== "test") {
      const mailToBeSent = {
        from: "shop-system-project@gmail.com",
        to: getUser.email,
        subject: "Buy success!",
        text: `You have purchased successfully the itens: ${userItem
          .map((item) => item.item_name)
          .toString()
          .replaceAll(",", ", ")}
  
        Check-out my github: https://github.com/Paiva2
        :)
        `,
      }

      queue.forEach(async (queueName) => {
        if (queueName.name === "mailQueue") {
          await queueName.add("nodemailer", mailToBeSent, {
            removeOnComplete: true,
            removeOnFail: false,
          })
        }
      })
    }

    return { userItem }
  }
}
