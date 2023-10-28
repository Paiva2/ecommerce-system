import prisma from "../../lib/prisma"
import { UserCoin } from "../@types/types"
import UserCoinRepository from "../repositories/UserCoinRepository"
import { randomUUID } from "node:crypto"

export default class PgUserCoin implements UserCoinRepository {
  #schema = process.env.DATABASE_SCHEMA

  async insert(quantity: number, coinName: string, coinOwner: string) {
    const [newUserCoin] = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
        INSERT INTO "${this.#schema}".user_coin
        ("id", "coin_name", "fkcoin_owner", "quantity")
        VALUES ($1, $2, $3, $4) ON CONFLICT()
        RETURNING *
       `,
      randomUUID(),
      coinName,
      coinOwner,
      quantity
    )

    return newUserCoin
  }
}
