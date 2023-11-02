import { StoreItem, StoreItemInsert } from "../@types/types"

export interface StoreItemRepository {
  insert(newItemList: StoreItemInsert[]): Promise<StoreItem[]>
  findStoreItems(storeId: string, storeCoinName: string): Promise<StoreItem[]>
}
