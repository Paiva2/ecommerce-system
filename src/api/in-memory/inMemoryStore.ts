import { Store } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryStore implements StoreRepository {
  private store = [] as Store[]

  async create(storeOwner: string, storeName: string) {
    const newStore = {
      id: randomUUID(),
      name: storeName,
      storeOwner,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.store.push(newStore)

    return newStore
  }

  async findUserStore(storeOwner: string) {
    const findStore = this.store.find((store) => store.storeOwner === storeOwner)

    if (!findStore) return null

    return findStore
  }
}
