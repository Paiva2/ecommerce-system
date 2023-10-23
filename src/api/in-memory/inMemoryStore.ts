import { Store } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryStore implements StoreRepository {
  private stores = [] as Store[]

  async create(storeOwner: string, storeName: string) {
    const newStore = {
      id: randomUUID(),
      name: storeName,
      storeOwner,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.stores.push(newStore)

    return newStore
  }

  async findUserStore(storeOwner: string) {
    const findStore = this.stores.find((store) => store.storeOwner === storeOwner)

    if (!findStore) return null

    return findStore
  }

  async getAllStores() {
    return this.stores
  }
}
