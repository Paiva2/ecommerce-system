import { UserItem, UserItemToPurchase } from "../@types/types"

export interface UserItemRepository {
  insertUserItemToUserPurchase(userItems: UserItemToPurchase[]): Promise<UserItem[]>

  findUserItems(userId: string): Promise<UserItem[]>
}
