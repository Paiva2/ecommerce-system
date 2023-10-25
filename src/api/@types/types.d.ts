export interface User {
  id: string
  username: string
  password?: string
  email: string
  store?: Store
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
}

export interface JwtSchema {
  data: {
    id: string
    email: string
    role: string
  }
}
