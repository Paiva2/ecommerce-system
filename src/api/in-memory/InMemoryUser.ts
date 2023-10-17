import { User } from "../@types/types"
import { UserRepository } from "../repositories/UserRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryUser implements UserRepository {
  private users: User[] = []

  async findByEmail(email: string) {
    const findUser = this.users.find((user) => user.email === email)

    if (!findUser) return null

    return findUser
  }

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
}
