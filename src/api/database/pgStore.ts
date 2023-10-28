import prisma from "../../lib/prisma"
import { Store, StoreCoin } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class PgStore implements StoreRepository {
  #schema = process.env.DATABASE_SCHEMA

  async create(storeOwner: string, storeName: string, storeDescription?: string) {
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

    await prisma.$queryRawUnsafe(`savepoint pre_creation_store`)

    return createdStore
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

    delete store.fkstore_owner

    return {
      ...store,
      storeOwner,
    }
  }

  async getAllStores() {
    const stores = await prisma.$queryRawUnsafe<Store[]>(
      `
    SELECT * FROM "${this.#schema}".store
   `
    )

    return stores
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
