export interface User {
  id: string
  username: string
  password?: string
  email: string
  store?: Store
  wallet?: Wallet
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
