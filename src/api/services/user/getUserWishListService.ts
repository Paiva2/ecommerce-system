import { WishListItem } from "../../@types/types"
import { UserRepository } from "../../repositories/UserRepository"
import UserWishListRepository from "../../repositories/UserWishListRepository"
import { WishListItemRepository } from "../../repositories/WishListItemRepository"

interface GetUserWishListServiceRequest {
  userId: string
}

interface GetUserWishListServiceResponse {
  getWishListItems: WishListItem[]
}

export default class GetUserWishListService {
  constructor(
    private userRepository: UserRepository,
    private userWishListRepository: UserWishListRepository,
    private wishListItemRepository: WishListItemRepository
  ) {}

  async execute({
    userId,
  }: GetUserWishListServiceRequest): Promise<GetUserWishListServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    }

    const getUser = await this.userRepository.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getWishList = await this.userWishListRepository.getUserWishList(getUser.id)

    const getWishListItems = await this.wishListItemRepository.findAll(
      getWishList.id
    )

    return { getWishListItems }
  }
}
