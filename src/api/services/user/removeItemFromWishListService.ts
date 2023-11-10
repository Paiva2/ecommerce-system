import { UserRepository } from "../../repositories/UserRepository"
import { WishListItemRepository } from "../../repositories/WishListItemRepository"
import UserWishListRepository from "../../repositories/UserWishListRepository"
import { WishListItem } from "../../@types/types"

interface RemoveItemFromWishListServiceRequest {
  userId: string
  itemId: string
}

interface RemoveItemFromWishListServiceResponse {
  updatedWishList: WishListItem[]
}

export default class RemoveItemFromWishListService {
  constructor(
    private userRepository: UserRepository,
    private userWishListRepository: UserWishListRepository,
    private wishListItemRepository: WishListItemRepository
  ) {}

  async execute({
    itemId,
    userId,
  }: RemoveItemFromWishListServiceRequest): Promise<RemoveItemFromWishListServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    } else if (!itemId) {
      throw {
        status: 403,
        error: "Invalid item id.",
      }
    }

    const getUser = await this.userRepository.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getUserWishList = await this.userWishListRepository.getUserWishList(
      getUser.id
    )

    const updatedWishList = await this.wishListItemRepository.removeItem(
      getUserWishList.id,
      itemId
    )

    return { updatedWishList }
  }
}
