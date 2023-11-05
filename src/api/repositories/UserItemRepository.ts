import { UserItem } from "../@types/types"

export interface UserItemRepository {
  insertUserItemToUserPurchase(
    itemOwner: string,
    purchasedWith: string,
    itemName: string,
    purchasedAt: string,
    quantity: number,
    value: number
  ): Promise<UserItem>
}
