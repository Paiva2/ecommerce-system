import prisma from "../../lib/prisma"
import { Store } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class PgStore implements StoreRepository {
  async create(storeOwner: string, storeName: string, storeDescription?: string) {
    const schema = process.env.DATABASE_SCHEMA

    const [newStore] = await prisma.$queryRawUnsafe<Store[]>(
      `
        INSERT INTO "${schema}".store
        ("id", "name", "fkstore_owner", "description")
        VALUES ($1, $2, $3, $4)
        RETURNING *
       `,
      randomUUID(),
      storeName,
      storeOwner,
      storeDescription
    )

    return newStore
  }

  async findUserStore(storeOwner: string) {
    const schema = process.env.DATABASE_SCHEMA

    const [store] = await prisma.$queryRawUnsafe<Store[]>(
      `
      SELECT * FROM "${schema}".store
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
    const schema = process.env.DATABASE_SCHEMA
    let formattedStores = [] as Store[]

    const stores = await prisma.$queryRawUnsafe<Store[]>(
      `
    SELECT * FROM "${schema}".store
   `
    )

    for (let store of stores) {
      formattedStores.push({
        id: store.id,
        name: store.name,
        storeOwner: store.fkstore_owner,
        created_At: store.created_At,
        updated_At: store.updated_At,
        description: store.description,
      })
    }

    return formattedStores
  }
}
