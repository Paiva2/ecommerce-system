import { UserCoin } from "../@types/types"
import UserCoinRepository from "../repositories/UserCoinRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryUserCoin implements UserCoinRepository {
  private userCoins: UserCoin[] = []

  async insert(quantity: number, coinName: string, coinOwner: string) {
    const newUserCoin = {
      id: randomUUID(),
      quantity,
      coin_name: coinName,
      fkcoin_owner: coinOwner,
      updated_at: new Date().toString(),
    }

    this.userCoins.push(newUserCoin)

    return newUserCoin
  }

  async addition(quantity: number, coinName: string, coinOwner: string) {
    let updatedUserCoin = {} as UserCoin

    const updatedValue = this.userCoins.map((coins) => {
      if (coins.fkcoin_owner === coinOwner && coins.coin_name === coinName) {
        coins = {
          ...coins,
          quantity: coins.quantity + quantity,
        }

        updatedUserCoin = coins
      }

      return coins
    })

    this.userCoins = updatedValue

    return updatedUserCoin
  }

  async findUserCoins(walletId: string) {
    const userCoin = this.userCoins.filter((coin) => coin.fkcoin_owner === walletId)

    return userCoin
  }

  async updateFullValue(newValue: number, walletId: string, storeCoinName: string) {
    let updatedUserCoin = {} as UserCoin

    const updatedUserCoins = this.userCoins.map((coin) => {
      if (coin.fkcoin_owner === walletId && coin.coin_name === storeCoinName) {
        coin = {
          ...coin,
          quantity: newValue,
        }

        updatedUserCoin = coin
      }

      return coin
    })

    this.userCoins = updatedUserCoins

    return updatedUserCoin
  }

  async findUserCoinByCoinName(walletId: string, coinName: string) {
    const getCoin = this.userCoins.find((coin) => {
      return coin.fkcoin_owner === walletId && coin.coin_name === coinName
    })

    if (!getCoin) return null

    return getCoin
  }

  async updateUserCoinsToStoreItemPurchase(
    walletId: string,
    coinId: string,
    valueToSubtract: number
  ) {
    let updatedCoinsValue = {} as UserCoin

    const storeCoinsUpdated = this.userCoins.map((coin) => {
      if (coin.fkcoin_owner === walletId && coin.id === coinId) {
        coin = {
          ...coin,
          quantity: coin.quantity - valueToSubtract,
        }

        updatedCoinsValue = coin
      }

      return coin
    })

    this.userCoins = storeCoinsUpdated

    return updatedCoinsValue
  }
}
