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
