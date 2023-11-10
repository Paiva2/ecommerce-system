import { randomUUID } from "node:crypto"
import { WishListItem } from "../@types/types"
import { WishListItemRepository } from "../repositories/WishListItemRepository"

export default class InMemoryWishListItem implements WishListItemRepository {
  private wishListItems: WishListItem[] = []

  async insertItem(
    wishListOwnerId: string,
    itemId: string,
    itemName: string,
    itemValue: number,
    itemImage: string
  ) {
    const newWishListItem = {
      id: randomUUID(),
      fk_wishlist_item_owner: wishListOwnerId,
      name: itemName,
      item_value: itemValue,
      item_image: itemImage,
      item_id: itemId,
    }

    this.wishListItems.push(newWishListItem)

    return newWishListItem
  }
}
