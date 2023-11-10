import { WishListItem } from "../@types/types"

export interface WishListItemRepository {
  insertItem(
    wishListOwnerId: string,
    itemId: string,
    itemName: string,
    itemValue: number,
    itemImage: string
  ): Promise<WishListItem>
}
