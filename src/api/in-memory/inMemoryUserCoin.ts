import { UserCoin } from "../@types/types"
import UserCoinRepository from "../repositories/UserCoinRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryUserCoin implements UserCoinRepository {
  #userCoin: UserCoin[] = []

  async insert(quantity: number, coinName: string, coinOwner: string) {
    const newUserCoin = {
      id: randomUUID(),
      quantity,
      coin_name: coinName,
      fkcoin_owner: coinOwner,
      updated_at: new Date().toString(),
    }

    this.#userCoin.push(newUserCoin)

    return newUserCoin
  }
}
