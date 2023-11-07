import prisma from "../../lib/prisma"
import { convertBigNumber } from "../../utils/convertBigNumber"
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
      VALUES ($1, $2, $3, cast($4 as numeric))
      RETURNING *
      `,
      randomUUID(),
      coinName,
      coinOwner,
      quantity.toFixed(2)
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
        SET quantity = $1 + (SELECT quantity FROM current)
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

  async findUserCoins(walletId: string) {
    const userCoins = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
      SELECT id, coin_name, updated_at, fkcoin_owner, quantity
      FROM "${this.#schema}".user_coin
      WHERE fkcoin_owner = $1
    `,
      walletId
    )

    return userCoins
  }

  async updateFullValue(newValue: number, walletId: string, storeCoinName: string) {
    const [userCoin] = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
      UPDATE "${this.#schema}".user_coin
      SET quantity = $1
      WHERE coin_name = $2 AND fkcoin_owner = $3
      RETURNING *
    `,
      newValue,
      storeCoinName,
      walletId
    )

    return userCoin
  }

  async findUserCoinByCoinName(walletId: string, coinName: string) {
    const [userCoin] = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
      SELECT * FROM "${this.#schema}".user_coin
      WHERE coin_name = $1 AND fkcoin_owner = $2
      `,
      coinName,
      walletId
    )

    return userCoin
  }

  async updateUserCoinsToStoreItemPurchase(
    walletId: string,
    coinId: string,
    valueToSubtract: number
  ) {

    try {
      const [userCoin] = await prisma.$queryRawUnsafe<UserCoin[]>(
        `
        WITH current_value AS(
        SELECT * FROM "${this.#schema}".user_coin
        WHERE fkcoin_owner = $1 AND id = $2
        ),
        new_qtt AS (
          SELECT quantity - CAST($3 AS numeric) FROM current_value
        ),
        update_value AS (
          UPDATE "${this.#schema}".user_coin
          SET quantity = (case when (SELECT * FROM new_qtt) < 1 then 0 else (SELECT * FROM new_qtt) end)
          WHERE fkcoin_owner = $1 AND id = $2
          RETURNING *
        )
  
        SELECT * FROM update_value
      `,
        walletId,
        coinId,
        valueToSubtract
      )

      return userCoin
    } catch {
      await prisma.$queryRawUnsafe(`rollback to pre_purchase_store_item`)

      throw {
        status: 500,
        error: "Internal Error.",
      }
    }
  }
}
