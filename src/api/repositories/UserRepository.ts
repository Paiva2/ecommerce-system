import { User } from "../@types/types"

export interface UserRepository {
  insert(email: string, username: string, password: string): Promise<User>
  findByEmail(email: string): Promise<User | null>
  update(email: string, newPassword: string): Promise<User>
  updateUserProfile(
    id: string,
    email: string,
    infosToUpdate: { username?: string; password?: string }
  ): Promise<User>
}
