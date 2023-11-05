import { UserItem } from "../@types/types"
import { UserItemRepository } from "../repositories/UserItemRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryUserItem implements UserItemRepository {
  private userItems: UserItem[] = []

  async insertUserItemToUserPurchase(
    itemOwner: string,
    purchasedWith: string,
    itemName: string,
    purchasedAt: string,
    quantity: number,
    value: number
  ) {
    const newItem = {
      id: randomUUID(),
      item_name: itemName,
      purchase_date: new Date(),
      purchased_at: purchasedAt,
      fkitem_owner: itemOwner,
      purchased_with: purchasedWith,
      quantity,
      item_value: value,
    }

    this.userItems.push(newItem)

    return newItem
  }
}
