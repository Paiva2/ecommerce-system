import prisma from "../../lib/prisma"
import { StoreCoin } from "../@types/types"
import { StoreCoinRepository } from "../repositories/StoreCoinRepository"
import { randomUUID } from "node:crypto"

export default class PgStoreCoin implements StoreCoinRepository {
  #schema = process.env.DATABASE_SCHEMA

  async findStoreCoin(storeId: string) {
    const [storeCoin] = await prisma.$queryRawUnsafe<StoreCoin[]>(
      `
      SELECT * from "${this.#schema}".store_coin
      WHERE fkstore_coin_owner = $1
     `,
      storeId
    )

    return storeCoin
  }

  async insert(storeCoinName: string, storeCoinOwner: string) {
    try {
      const [createdStoreCoin] = await prisma.$queryRawUnsafe<StoreCoin[]>(
        `
        INSERT INTO "${this.#schema}".store_coin
        ("id", "store_coin_name", "fkstore_coin_owner")
        VALUES ($1, $2, $3)
        RETURNING *
       `,
        randomUUID(),
        storeCoinName,
        storeCoinOwner
      )

      await prisma.$queryRawUnsafe(`commit`)

      return createdStoreCoin
    } catch {
      await prisma.$queryRawUnsafe(`rollback to pre_creation_store`)

      throw {
        status: 500,
        error: "Unable to create new store. Server error.",
      }
    }
  }

  async getAll() {
    const storeCoin = await prisma.$queryRawUnsafe<StoreCoin[]>(
      `
      SELECT * from "${this.#schema}".store_coin
     `
    )

    return storeCoin
  }
}
