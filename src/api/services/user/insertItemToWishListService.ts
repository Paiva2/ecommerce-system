import { WishListItem } from "../../@types/types"
import { StoreItemRepository } from "../../repositories/StoreItemRepository"
import { UserRepository } from "../../repositories/UserRepository"
import { WishListItemRepository } from "../../repositories/WishListItemRepository"
import UserWishListRepository from "../../repositories/UserWishListRepository"

interface InsertItemToWishListServiceRequest {
  userId: string
  itemId: string
}

interface InsertItemToWishListServiceResponse {
  newWishListItem: WishListItem
}

export default class InsertItemToWishListService {
  constructor(
    private userRepository: UserRepository,
    private userWishListRepository: UserWishListRepository,
    private storeItemRepository: StoreItemRepository,
    private wishListItemRepository: WishListItemRepository
  ) {}

  async execute({
    itemId,
    userId,
  }: InsertItemToWishListServiceRequest): Promise<InsertItemToWishListServiceResponse> {
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

    const getStoreItem = await this.storeItemRepository.findStoreItemById(itemId)

    if (!getStoreItem) {
      throw {
        status: 404,
        error: "Store item not found.",
      }
    }

    const getUserWishList = await this.userWishListRepository.getUserWishList(userId)

    const newWishListItem = await this.wishListItemRepository.insertItem(
      getUserWishList.id,
      itemId,
      getStoreItem.item_name,
      getStoreItem.value,
      getStoreItem.item_image
    )

    return { newWishListItem }
  }
}
