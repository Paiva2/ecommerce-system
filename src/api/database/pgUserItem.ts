import prisma from "../../lib/prisma"
import { UserItemRepository } from "../repositories/UserItemRepository"
import { randomUUID } from "node:crypto"
import "dotenv/config"
import { UserItem } from "../@types/types"

export default class PgUserItem implements UserItemRepository {
  private schema = process.env.DATABASE_SCHEMA

  async insertUserItemToUserPurchase(
    itemOwner: string,
    purchasedWith: string,
    itemName: string,
    purchasedAt: string,
    quantity: number,
    value: number
  ) {
    try {
      const [userItem] = await prisma.$queryRawUnsafe<UserItem[]>(
        `
          INSERT INTO "${this.schema}".user_item
          ("id", "item_name", "purchased_with", "purchased_at", "fkitem_owner", "quantity", "item_value")
          VALUES ($1, $2, $3, $4, $5, CAST($6 AS integer), $7)
          RETURNING *
      `,
        randomUUID(),
        itemName,
        purchasedWith,
        purchasedAt,
        itemOwner,
        quantity,
        value
      )

      await prisma.$queryRawUnsafe(`COMMIT`)

      return userItem
    } catch {
      await prisma.$queryRawUnsafe(`rollback to pre_purchase_store_item`)

      throw {
        status: 500,
        error: "Internal Error.",
      }
    }
  }
}
