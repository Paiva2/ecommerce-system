import prisma from "../../lib/prisma"
import { StoreItemInsert, StoreItem } from "../@types/types"
import { StoreItemRepository } from "../repositories/StoreItemRepository"
import { randomUUID } from "node:crypto"

export default class PgStoreItem implements StoreItemRepository {
  private schema = process.env.DATABASE_SCHEMA

  async insert(newItemList: StoreItemInsert[]) {
    const queriesArr = []
    const storeId = newItemList[0].storeId

    for (let item of newItemList) {
      const uuid = randomUUID()

      queriesArr.push([
        `('${uuid}', '${item.itemName}', '${item.value}', '${item.quantity}', '${
          item.itemImage ?? ""
        }', '${item.description}','${item.storeId}', '${item.storeCoin}', '${
          item.promotion ?? false
        }', '${item.promotionalValue ?? 0}', '${item.colors}', '${item.sizes}')`,
      ])
    }

    const formatQueryValues = queriesArr.toString()

    const itemList = await prisma.$queryRawUnsafe<StoreItem[]>(
      `
        INSERT INTO "${this.schema}".store_item
        (id, item_name, value, quantity, item_image, description, 
        fkstore_id, fkstore_coin, promotion, promotional_value, colors, sizes)
        VALUES ${formatQueryValues}
        RETURNING *
    `,
      storeId
    )

    return itemList
  }

  async findStoreItems(storeId: string, storeCoinName: string) {
    const itemList = await prisma.$queryRawUnsafe<StoreItem[]>(
      `
        SELECT * FROM "${this.schema}".store_item
        WHERE fkstore_id = $1 AND fkstore_coin = $2
    `,
      storeId,
      storeCoinName
    )

    return itemList
  }
}
