import prisma from "../../lib/prisma"
import { User } from "../@types/types"
import { UserRepository } from "../repositories/UserRepository"
import { randomUUID } from "node:crypto"
import "dotenv/config"

export default class PgUser implements UserRepository {
  #schema = process.env.DATABASE_SCHEMA

  async insert(email: string, username: string, password: string) {
    await prisma.$queryRawUnsafe(`BEGIN`)

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

    await prisma.$queryRawUnsafe(`savepoint pre_creation_user`)

    return userCreated
  }

  async findByEmail(email: string) {
    const [user] = await prisma.$queryRawUnsafe<User[]>(
      `
      SELECT * FROM "${this.#schema}".user
      WHERE email = $1
    `,
      email
    )

    if (!user) return null

    return user
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
