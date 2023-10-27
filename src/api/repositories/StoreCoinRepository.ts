import { StoreCoin } from "../@types/types"

export interface StoreCoinRepository {
  findStoreCoin(storeId: string): Promise<StoreCoin | null>
}
