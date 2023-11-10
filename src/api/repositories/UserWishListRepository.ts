import { UserWishList } from "../@types/types"

export default interface UserWishListRepository {
  create(userId: string): Promise<UserWishList>

  getUserWishList(userId: string): Promise<UserWishList>
}
