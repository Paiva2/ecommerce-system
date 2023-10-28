import prisma from "../../lib/prisma"
import { Store, StoreCoin } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class PgStore implements StoreRepository {
  #schema = process.env.DATABASE_SCHEMA

  async create(
    storeOwner: string,
    storeName: string,
    storeCoin: string,
    storeDescription?: string
  ) {
    let newStore: Store
    let newStoreCoin: StoreCoin

    try {
      await prisma.$queryRawUnsafe(`BEGIN`)

      const [createdStore] = await prisma.$queryRawUnsafe<Store[]>(
        `
      INSERT INTO "${this.#schema}".store
      ("id", "name", "fkstore_owner", "description")
      VALUES ($1, $2, $3, $4)
      RETURNING *
     `,
        randomUUID(),
        storeName,
        storeOwner,
        storeDescription
      )

      await prisma.$queryRawUnsafe(`savepoint pre_creation`)

      const [createdStoreCoin] = await prisma.$queryRawUnsafe<StoreCoin[]>(
        `
      INSERT INTO "${this.#schema}".store_coin
      ("id", "store_coin_name", "fkstore_coin_owner")
      VALUES ($1, $2, $3)
      RETURNING *
     `,
        randomUUID(),
        storeCoin,
        createdStore.id
      )

      newStore = createdStore
      newStoreCoin = createdStoreCoin

      await prisma.$queryRawUnsafe(`commit`)
    } catch {
      await prisma.$queryRawUnsafe(`rollback pre_creation`)
    }

    const formatNewStore = {
      ...newStore,
      storeCoin: newStoreCoin,
    }

    return formatNewStore
  }

  async findUserStore(storeOwner: string) {
    const [store] = await prisma.$queryRawUnsafe<Store[]>(
      `
      SELECT * FROM "${this.#schema}".store
      WHERE fkstore_owner = $1
     `,
      storeOwner
    )

    if (!store) return null

    const [storeCoin] = await prisma.$queryRawUnsafe<StoreCoin[]>(
      `
      SELECT * FROM "${this.#schema}".store_coin
      WHERE fkstore_coin_owner = $1
     `,
      store.id
    )

    delete store.fkstore_owner

    return {
      ...store,
      storeOwner,
      store_coin: storeCoin,
    }
  }

  async getAllStores() {
    let formattedStores = [] as Store[]

    const stores = await prisma.$queryRawUnsafe<Store[]>(
      `
    SELECT * FROM "${this.#schema}".store
   `
    )

    const storeCoins = await prisma.$queryRawUnsafe<StoreCoin[]>(`
    SELECT * from "${this.#schema}".store_coin
    `)

    for (let store of stores) {
      for (let coin of storeCoins) {
        if (store.id === coin.fkstore_coin_owner) {
          formattedStores.push({
            id: store.id,
            name: store.name,
            storeOwner: store.fkstore_owner,
            created_At: store.created_At,
            updated_At: store.updated_At,
            description: store.description,
            store_coin: {
              id: coin.id,
              fkstore_coin_owner: coin.fkstore_coin_owner,
              store_coin_name: coin.store_coin_name,
            },
          })
        }
      }
    }

    return formattedStores
  }

  async findUniqueById(storeId: string) {
    const [store] = await prisma.$queryRawUnsafe<Store[]>(
      `
      SELECT * FROM "${this.#schema}".store
      WHERE id = $1
     `,
      storeId
    )

    if (!store) return null

    const formattedStore = {
      ...store,
      storeOwner: store.fkstore_owner,
    }

    delete store.fkstore_owner

    return formattedStore
  }

  async update(storeUpdate: {
    storeId: string
    name?: string
    description?: string
  }) {
    const fieldsToUpdate = Object.keys(storeUpdate)

    let querySet = []

    for (let field of fieldsToUpdate) {
      if (field !== "storeId") {
        querySet.push(`${field} = '${storeUpdate[field]}'`)
      }
    }

    const query = `
    UPDATE "${this.#schema}".store
    SET ${String(querySet)}, updated_at = to_timestamp($1 / 1000.0)
    WHERE id = $2
`

    const [updatedStore] = await prisma.$queryRawUnsafe<Store[]>(
      query,
      Date.now(),
      storeUpdate.storeId
    )

    return updatedStore
  }
}
