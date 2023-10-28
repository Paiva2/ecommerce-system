import { UserCoin } from "../@types/types"

export default interface UserCoinRepository {
  insert(quantity: number, coinName: string, coinOwner: string): Promise<UserCoin>
}
