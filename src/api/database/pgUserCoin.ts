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
        VALUES ($1, $2, $3, $4)
        RETURNING *
       `,
      randomUUID(),
      coinName,
      coinOwner,
      quantity
    )

    return newUserCoin
  }

  async addition(quantity: number, coinName: string, coinOwner: string) {
    const [updatedUserCoin] = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
      WITH current AS (
        SELECT * FROM "${this.#schema}".user_coin
        WHERE fkcoin_owner = $2 AND coin_name = $3
      ),
      updated AS (
        UPDATE "${this.#schema}".user_coin
        SET "quantity" = $1 + (SELECT quantity FROM current)
        WHERE fkcoin_owner = $2 AND coin_name = $3
        RETURNING *
      )

      SELECT * FROM updated;
       `,
      quantity,
      coinOwner,
      coinName
    )

    return updatedUserCoin
  }
}
