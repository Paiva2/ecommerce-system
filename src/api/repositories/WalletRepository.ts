import { Wallet } from "../@types/types"

export default interface WalletRepository {
  create(userId: string): Promise<Wallet>
}
