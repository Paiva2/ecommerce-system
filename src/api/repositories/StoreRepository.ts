import { Store } from "../@types/types"

export interface StoreRepository {
  create(
    storeOwner: string,
    storeName: string,
    storeCoin: string,
    storeDescription?: string
  ): Promise<Store>

  // return all informations
  findUserStore(storeOwner: string): Promise<Store | null>

  getAllStores(): Promise<Store[]>

  // dont return all informations
  findUniqueById(storeId: string): Promise<Store | null>

  update(storeUpdate: {
    storeId: string
    name?: string
    description?: string
  }): Promise<Store>
}
