import { Store } from "../@types/types"

export interface StoreRepository {
  create(storeOwner: string, storeName: string): Promise<Store>
}
