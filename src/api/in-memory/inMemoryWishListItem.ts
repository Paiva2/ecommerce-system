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

  async findAll(wishListOwnerId: string) {
    const findAllUserWishListItems = this.wishListItems.filter(
      (item) => item.fk_wishlist_item_owner === wishListOwnerId
    )

    return findAllUserWishListItems
  }

  async removeItem(wishListOwnerId: string, itemId: string) {
    const findItem = this.wishListItems.find(
      (item) => item.id === itemId && item.fk_wishlist_item_owner === wishListOwnerId
    )

    const getItemIndex = this.wishListItems.indexOf(findItem)

    this.wishListItems.splice(getItemIndex, 1)

    const updatedUserWishListItem = this.wishListItems.filter(
      (item) => item.fk_wishlist_item_owner === wishListOwnerId
    )

    return updatedUserWishListItem
  }
}
