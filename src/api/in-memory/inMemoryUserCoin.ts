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
}
