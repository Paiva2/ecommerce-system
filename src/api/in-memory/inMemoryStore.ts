import { Store } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryStore implements StoreRepository {
  private stores = [] as Store[]

  async create(
    storeOwner: string,
    storeName: string,
    storeCoin: string,
    storeDescription?: string
  ) {
    const newStore = {
      id: randomUUID(),
      name: storeName,
      storeOwner,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: storeDescription,
    }

    const newStoreCoin = {
      id: randomUUID(),
      store_coin_name: storeCoin,
      updated_At: new Date(),
      created_At: new Date(),
      fkstore_coin_owner: newStore.id,
    }

    const formatNewStore = {
      ...newStore,
      store_coin: newStoreCoin,
    }

    this.stores.push(formatNewStore)

    return formatNewStore
  }

  async findUserStore(storeOwner: string) {
    const findStore = this.stores.find((store) => store.storeOwner === storeOwner)

    if (!findStore) return null

    return findStore
  }

  async getAllStores() {
    return this.stores
  }

  async findUnique(storeId: string) {
    const findStore = this.stores.find((store) => store.id === storeId)

    if (!findStore) return null

    return findStore
  }

  async update(storeUpdate: {
    storeId: string
    name?: string
    description?: string
  }) {
    const fieldsToUpdate = Object.keys(storeUpdate)
    let updatedStore = {} as Store

    const updatedStores = this.stores.map((store) => {
      if (store.id === storeUpdate.storeId) {
        for (let field of fieldsToUpdate) {
          store = {
            ...store,
            [field]: storeUpdate[field],
          }
        }

        updatedStore = store
      }

      return store
    })

    this.stores = updatedStores

    return updatedStore
  }
}
