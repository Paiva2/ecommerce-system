import prisma from "../../lib/prisma"
import { Store, User, UserCoin, Wallet } from "../@types/types"
import { UserRepository } from "../repositories/UserRepository"
import { randomUUID } from "node:crypto"
import "dotenv/config"

export default class PgUser implements UserRepository {
  #schema = process.env.DATABASE_SCHEMA

  async insert(email: string, username: string, password: string) {
    const [userCreated] = await prisma.$queryRawUnsafe<User[]>(
      `
        INSERT INTO "${this.#schema}".user
        ("id", "email", "username", "password")
        VALUES ($1, $2, $3, $4)
        RETURNING *
       `,
      randomUUID(),
      email,
      username,
      password
    )

    const [newUserWallet] = await prisma.$queryRawUnsafe<Wallet[]>(
      `
        INSERT INTO "${this.#schema}".user_wallet
        ("id", "fkwallet_owner")
        VALUES ($1, $2)
        RETURNING *
       `,
      randomUUID(),
      userCreated.id
    )

    const newUser = {
      ...userCreated,
      wallet: newUserWallet,
    }

    return newUser
  }

  async findByEmail(email: string) {
    let coins: UserCoin[] = []

    const [user] = await prisma.$queryRawUnsafe<User[]>(
      `
      SELECT * FROM "${this.#schema}".user
      WHERE email = $1
    `,
      email
    )

    if (!user) return null

    const [userWallet] = await prisma.$queryRawUnsafe<Wallet[]>(
      `
      SELECT * FROM "${this.#schema}".user_wallet
      WHERE fkwallet_owner = $1
    `,
      user.id
    )

    const userCoins = await prisma.$queryRawUnsafe<UserCoin[]>(
      `
      SELECT * FROM "${this.#schema}".user_coin
      WHERE fkcoin_owner = $1
    `,
      userWallet.id
    )

    for (let coin of userCoins) {
      coins.push({
        coin_name: coin.coin_name,
        fkcoin_owner: coin.fkcoin_owner,
        id: coin.id,
        quantity: Number(String(coin.quantity)), // serialize big int
        updated_at: coin.updated_at,
      })
    }

    const formatUser = {
      ...user,
      wallet: {
        ...userWallet,
        coins,
      },
    }

    return formatUser
  }

  async update(email: string, newPassword: string) {
    const [updatedUser] = await prisma.$queryRawUnsafe<User[]>(
      `
      UPDATE "${this.#schema}".user
      SET password = $1
      WHERE email = $2
    `,
      newPassword,
      email
    )

    return updatedUser
  }

  async updateUserProfile(
    id: string,
    email: string,
    infosToUpdate: { username?: string; password?: string }
  ) {
    const queryFields = [] as string[]
    let newValues = []

    const fieldsToNotUpdate = ["oldPassword", "email", "id", "store"]

    const fieldsToUpdate = Object.keys(infosToUpdate).filter((field) => {
      return !fieldsToNotUpdate.includes(field)
    })

    for (let field of fieldsToUpdate) {
      queryFields.push(`${field} = '${infosToUpdate[field]}'`)

      newValues.push(infosToUpdate[field])
    }

    const query = `
    UPDATE "${this.#schema}".user
    SET ${queryFields.toString()}
    WHERE email = $1 AND id = $2
    RETURNING *
    `

    const [updatedUserProfile] = await prisma.$queryRawUnsafe<User[]>(
      query,
      email,
      id
    )

    return updatedUserProfile
  }
}
