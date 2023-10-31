import { StoreCoin } from "../@types/types"

export interface StoreCoinRepository {
  findStoreCoin(storeId: string): Promise<StoreCoin | null>

  insert(
    storeCoinName: string,
    storeCoinOwner: string
  ): Promise<StoreCoin>

  getAll(): Promise<StoreCoin[]>

  findStoreCoinByName(
    storeCoinName: string
  ): Promise<StoreCoin | null>
}
