import { randomUUID } from "node:crypto"
import { UserWishList } from "../@types/types"
import UserWishListRepository from "../repositories/UserWishListRepository"

export default class InMemoryUserWishList implements UserWishListRepository {
  private wishLists: UserWishList[] = []

  async create(userId: string) {
    const newWishList = {
      id: randomUUID(),
      fkwishlist_owner: userId,
      items: [],
    }

    this.wishLists.push(newWishList)

    return newWishList
  }

  async getUserWishList(userId: string) {
    const userWishList = this.wishLists.find(
      (wishlist) => wishlist.fkwishlist_owner === userId
    )

    return userWishList
  }
}
