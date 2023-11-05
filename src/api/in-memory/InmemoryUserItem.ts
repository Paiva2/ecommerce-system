import { UserItem } from "../@types/types"
import { UserItemRepository } from "../repositories/UserItemRepository"
import { randomUUID } from "node:crypto"

interface UserItemToUserPurchase {
  itemOwner: string
  purchasedWith: string
  itemName: string
  purchasedAt: string
  quantity: number
  value: number
  totalValue: number
}

export default class InMemoryUserItem implements UserItemRepository {
  private userItems: UserItem[] = []

  async insertUserItemToUserPurchase(items: UserItemToUserPurchase[]) {
    const newUserItems: UserItem[] = []

    for (let item of items) {
      const newItem = {
        id: randomUUID(),
        item_name: item.itemName,
        purchase_date: new Date(),
        purchased_at: item.purchasedAt,
        fkitem_owner: item.itemOwner,
        purchased_with: item.purchasedWith,
        quantity: item.quantity,
        item_value: item.value,
        total_value: item.totalValue,
      }

      this.userItems.push(newItem)

      newUserItems.push(newItem)
    }

    return newUserItems
  }

  async findUserItems(userId: string) {
    const getUserItems = this.userItems.filter(
      (item) => item.fkitem_owner === userId
    )

    return getUserItems
  }
}
