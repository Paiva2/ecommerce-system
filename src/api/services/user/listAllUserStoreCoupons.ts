import { StoreCoupon } from "../../@types/types"
import StoreCouponRepository from "../../repositories/StoreCouponRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface ListAllUserStoreCouponsRequestService {
  userId: string
}

interface ListAllUserStoreCouponsResponseService {
  storeCoupons: StoreCoupon[]
}

export default class ListAllUserStoreCouponsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeCouponRepository: StoreCouponRepository
  ) {}

  async execute({
    userId,
  }: ListAllUserStoreCouponsRequestService): Promise<ListAllUserStoreCouponsResponseService> {
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

    const getUserStore = await this.storeRepository.findUserStore(getUser.email)

    if (!getUserStore) {
      throw {
        status: 404,
        error: "User has no store created.",
      }
    }

    const storeCoupons = await this.storeCouponRepository.findStoreCoupons(
      getUserStore.id
    )

    return { storeCoupons }
  }
}
