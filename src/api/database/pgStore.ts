import prisma from "../../lib/prisma"
import { Store } from "../@types/types"
import { StoreRepository } from "../repositories/StoreRepository"
import { randomUUID } from "node:crypto"

export default class PgStore implements StoreRepository {
  async create(storeOwner: string, storeName: string) {
    const schema = process.env.DATABASE_SCHEMA

    const [newStore] = await prisma.$queryRawUnsafe<Store[]>(
      `
        INSERT INTO "${schema}".store
        ("id", "name", "fkstore_owner")
        VALUES ($1, $2, $3)
        RETURNING *
       `,
      randomUUID(),
      storeName,
      storeOwner
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

    return store
  }
}
