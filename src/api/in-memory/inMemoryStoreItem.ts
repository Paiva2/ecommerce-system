import { StoreItem, StoreItemInsert } from "../@types/types"
import { StoreItemRepository } from "../repositories/StoreItemRepository"
import { randomUUID } from "node:crypto"

export default class InMemoryStoreItem
  implements StoreItemRepository
{
  private storeItens = [] as StoreItem[]

  async insert(newItemList: StoreItemInsert[]) {
    const newItemListFormatted = []

    for (let item of newItemList) {
      const itemToInsert = {
        id: randomUUID(),
        item_name: item.itemName,
        value: item.value,
        quantity: item.quantity,
        item_image: item.itemImage ?? null,
        description: item.description,
        created_at: new Date(),
        updated_at: new Date(),
        promotion: item.promotion ?? false,
        promotional_value: item.promotion
          ? item.promotionalValue
          : null,
        fkstore_id: item.storeId,
        fkstore_coin: item.storeCoin,
        colors: item.colors,
        sizes: item.sizes,
      }

      this.storeItens.push(itemToInsert)
      newItemListFormatted.push(itemToInsert)
    }

    return newItemListFormatted
  }
}
