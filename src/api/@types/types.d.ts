export interface User {
  id: string
  username: string
  password: string
  email: string
}

export interface ErrorService {
  status: number
  error: string
}

export interface Store {
  id: string
  name: string
  storeOwner: string
  updatedAt?: Date
  createdAt?: Date
}

export interface JwtSchema {
  data: {
    id: string
    email: string
    role: string
  }
}
