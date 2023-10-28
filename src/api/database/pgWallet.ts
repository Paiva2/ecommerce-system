import prisma from "../../lib/prisma"
import { Wallet } from "../@types/types"
import WalletRepository from "../repositories/WalletRepository"
import { randomUUID } from "node:crypto"

export default class PgWallet implements WalletRepository {
  #schema = process.env.DATABASE_SCHEMA

  async create(userId: string) {
    try {
      const [newUserWallet] = await prisma.$queryRawUnsafe<Wallet[]>(
        `
        INSERT INTO "${this.#schema}".user_wallet
        ("id", "fkwallet_owner")
        VALUES ($1, $2)
        RETURNING *
      `,
        randomUUID(),
        userId
      )

      await prisma.$queryRawUnsafe(`commit`)

      return newUserWallet
    } catch {
      await prisma.$queryRawUnsafe(`rollback to pre_creation_user`)

      throw {
        status: 500,
        error: "Unable to create new user. Server error.",
      }
    }
  }

  async findUserWallet(userId: string) {
    const [wallet] = await prisma.$queryRawUnsafe<Wallet[]>(
      `
     SELECT * FROM "${this.#schema}".user_wallet
     WHERE fkwallet_owner = $1
    `,
      userId
    )

    return wallet
  }
}
