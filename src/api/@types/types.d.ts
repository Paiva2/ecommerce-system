export interface User {
  id: string
  username: string
  password?: string
  email: string
  store?: Store
  wallet?: Wallet
  userItems?: UserItem[]
  storeCoupon?: StoreCoupon[]
}

export interface ErrorService {
  status: number
  error: string
}

export interface Store {
  id: string
  name: string
  storeOwner: string
  updated_At?: Date
  created_At?: Date
  fkstore_owner?: string
  description?: string
  store_coin?: StoreCoin
  store_item?: StoreItem[]
}

interface StoreCoin {
  id: string
  store_coin_name: string
  updated_At?: Date
  created_At?: Date
  fkstore_coin_owner: string
}

export interface JwtSchema {
  data: {
    id: string
    email: string
    role: string
  }
}

interface Wallet {
  id: string
  fkwallet_owner: string
  coins?: UserCoin[]
}

interface UserCoin {
  id: string
  coin_name: string
  updated_at: string
  fkcoin_owner: string
  quantity: number
}

interface StoreItem {
  id: string
  item_name: string
  value: number
  quantity: number
  description: string
  fkstore_id: string
  fkstore_coin: string
  colors: string
  sizes: string
  item_image?: string
  created_at?: Date
  updated_at?: Date
  promotion?: boolean
  promotional_value?: number
}

export interface StoreItemInsert {
  storeId: string
  itemName: string
  value: number
  quantity: number
  description: string
  colors: string
  sizes: string
  storeCoin: string
  updatedAt?: string
  promotion?: boolean
  promotionalValue?: number
  itemImage?: string
}

export interface StoreItemRequestPayload {
  itemName: string
  value: number
  quantity: number
  description: string
  promotion: boolean
  promotionalValue: number
  itemImage: string
  colors: string
  sizes: string
}

export interface UserItem {
  id: string
  item_name: string
  purchase_date?: Date
  purchased_at: string
  fkitem_owner: string
  purchased_with: string
  quantity: number
  item_value: number
  total_value: number
}

export interface UserItemToPurchase {
  itemOwner: string
  purchasedWith: string
  itemName: string
  purchasedAt: string
  quantity: number
  value: number
  totalValue: number
}

export interface StoreCoupon {
  id?: string
  discount: number
  coupon_code: string
  fkcoupon_owner: string
  active: boolean
  created_At?: Date
  updated_at?: Date
  validation_date?: Date
}

interface UpdateStoreItem {
  item_name?: string
  value?: number
  quantity?: number
  description?: string
  colors?: string
  sizes?: string
  item_image?: string
  promotion?: boolean
  promotional_value?: number
}
