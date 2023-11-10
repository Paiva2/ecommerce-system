import { randomUUID } from "crypto"
import prisma from "../../lib/prisma"
import { WishListItem } from "../@types/types"
import { WishListItemRepository } from "../repositories/WishListItemRepository"

export default class PgWishListItem implements WishListItemRepository {
  private schema = process.env.DATABASE_SCHEMA

  async insertItem(
    wishListOwnerId: string,
    itemId: string,
    itemName: string,
    itemValue: number,
    itemImage: string
  ) {
    const [wishListItem] = await prisma.$queryRawUnsafe<WishListItem[]>(
      `
        INSERT INTO "${this.schema}".wishlist_item
        ("id", "fkwishlist_item_owner", "name", "item_value", "item_image", "item_id") VALUES 
        ($1, $2, $3, CAST($4 as numeric), $5, $6)
        RETURNING *
    `,
      randomUUID(),
      wishListOwnerId,
      itemName,
      itemValue,
      itemImage,
      itemId
    )

    return wishListItem
  }

  async findAll(wishListOwnerId: string) {
    const wishListItems = await prisma.$queryRawUnsafe<WishListItem[]>(
      `
        SELECT * FROM "${this.schema}".wishlist_item WHERE fkwishlist_item_owner = $1
    `,
      wishListOwnerId
    )

    return wishListItems
  }

  async removeItem(wishListOwnerId: string, itemId: string) {
    const updatedWishList = await prisma.$queryRawUnsafe<WishListItem[]>(
      `
      WITH remove_item AS(
        DELETE FROM "${this.schema}".wishlist_item WHERE id = $1
      ),
      get_updated_list AS (
        SELECT * FROM "${this.schema}".wishlist_item WHERE fkwishlist_item_owner = $2
      )

      SELECT * FROM get_updated_list
  `,
      itemId,
      wishListOwnerId
    )

    return updatedWishList
  }
}
