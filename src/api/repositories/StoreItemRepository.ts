import { StoreItem, StoreItemInsert } from "../@types/types"

export interface StoreItemRepository {
  insert(newItemList: StoreItemInsert[]): Promise<StoreItem[]>

  findStoreItems(
    storeId: string,
    storeCoinName: string,
    page?: number
  ): Promise<StoreItem[]>

  findStoreItem(storeId: string, itemId: string): Promise<StoreItem | null>
}
