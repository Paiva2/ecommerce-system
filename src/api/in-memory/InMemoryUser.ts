import { User } from "../@types/types"
import { UserRepository } from "../repositories/UserRepository"
import { randomUUID } from "node:crypto"
export default class InMemoryUser implements UserRepository {
  private users: User[] = []

  async insert(email: string, username: string, password: string) {
    const newUser = {
      id: randomUUID(),
      username,
      email,
      password,
    }

    this.users.push(newUser)

    return newUser
  }

  async update(email: string, newPassword: string) {
    let updatedUser = {} as User

    const updatedUsers = this.users.map((user) => {
      if (user.email === email) {
        user = {
          ...user,
          password: newPassword,
        }

        updatedUser = user
      }

      return user
    })

    this.users = updatedUsers

    return updatedUser
  }

  async findByEmail(email: string) {
    const findUser = this.users.find((user) => user.email === email)

    if (!findUser) return null

    return findUser
  }

  async updateUserProfile(id: string, email: string, infosToUpdate: User) {
    const fieldsToUpdate = Object.keys(infosToUpdate)
    const fieldsToNotUpdate = ["email", "id", "oldPassword"]

    const newUsers = this.users.map((user) => {
      if (user.email === email) {
        for (let field of fieldsToUpdate) {
          if (!fieldsToNotUpdate.includes(field)) {
            user = {
              ...user,
              [field]: infosToUpdate[field],
            }
          }
        }
      }

      return user
    })

    const getUserUpdated = newUsers.find(
      (user) => user.email === email && user.id === id
    )

    this.users = newUsers

    return getUserUpdated
  }
}
