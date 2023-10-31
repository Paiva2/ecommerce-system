import { StoreCoinRepository } from "../repositories/StoreCoinRepository"
import { randomUUID } from "node:crypto"
import { StoreCoin } from "../@types/types"

export default class InMemoryStoreCoin
  implements StoreCoinRepository
{
  #storeCoins: StoreCoin[] = []

  async findStoreCoin(storeId: string) {
    const getStore = this.#storeCoins.find(
      (store) => store.fkstore_coin_owner === storeId
    )

    if (!getStore) return null

    return getStore
  }

  async insert(storeCoin: string, storeCoinOwner: string) {
    const newStoreCoin = {
      id: randomUUID(),
      fkstore_coin_owner: storeCoinOwner,
      store_coin_name: storeCoin,
      created_At: new Date(),
      updated_at: new Date(),
    }

    this.#storeCoins.push(newStoreCoin)

    return newStoreCoin
  }

  async getAll() {
    return this.#storeCoins
  }

  async findStoreCoinByName(storeCoinName: string) {
    const doesStoreCoinNameAlreadyExists = this.#storeCoins.find(
      (storeCoin) => storeCoin.store_coin_name === storeCoinName
    )

    if (!doesStoreCoinNameAlreadyExists) return null

    return doesStoreCoinNameAlreadyExists
  }
}
