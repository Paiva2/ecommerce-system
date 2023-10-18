export interface User {
  username: string
  password: string
  email: string
}

export interface ErrorService {
  status: number
  error: string
}
