import { Store } from "../@types/types"

export interface StoreRepository {
  create(
    storeOwner: string,
    storeName: string,
    storeDescription?: string
  ): Promise<Store>

  findUserStore(storeOwner: string): Promise<Store | null>

  getAllStores(): Promise<Store[]>

  findUnique(storeId: string): Promise<Store | null>

  update(storeUpdate: {
    storeId: string
    name?: string
    description?: string
  }): Promise<Store>
}
