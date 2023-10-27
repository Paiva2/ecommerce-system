import { Wallet } from "../@types/types"
import WalletRepository from "../repositories/WalletRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryWallet implements WalletRepository {
  #wallets: Wallet[] = []

  async create(userId: string) {
    const newWallet = {
      id: randomUUID(),
      fkwallet_owner: userId,
      coins: [],
    }

    this.#wallets.push(newWallet)

    return newWallet
  }
}
