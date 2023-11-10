import prisma from "../../lib/prisma"
import { UserItemRepository } from "../repositories/UserItemRepository"
import { randomUUID } from "node:crypto"
import "dotenv/config"
import { UserItem, UserItemToPurchase } from "../@types/types"

export default class PgUserItem implements UserItemRepository {
  private schema = process.env.DATABASE_SCHEMA

  async insertUserItemToUserPurchase(desiredItems: UserItemToPurchase[]) {
    let queryValues: string[] = []

    for (let item of desiredItems) {
      queryValues.push(
        `
        ('${randomUUID()}', '${item.itemName}', '${item.purchasedWith}', 
        '${item.purchasedAt}', '${item.itemOwner}', '${item.quantity}', 
        CAST(${item.value} AS integer), '${item.totalValue}'
        )`
      )
    }

    try {
      const userItem = await prisma.$queryRawUnsafe<UserItem[]>(
        `
          INSERT INTO "${this.schema}".user_item
          ("id", "item_name", "purchased_with", "purchased_at", 
          "fkitem_owner", "quantity", "item_value", "total_value") VALUES 
          ${queryValues.toString()}
          RETURNING *
      `
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

  async findUserItems(userId: string) {
    const userItems = await prisma.$queryRawUnsafe<UserItem[]>(
      `
        SELECT * FROM "${this.schema}".user_item
        WHERE fkitem_owner = $1
      `,
      userId
    )

    return userItems
  }
}
