import { StoreCoupon } from "../../@types/types"
import StoreCouponRepository from "../../repositories/StoreCouponRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface CreateCouponStoreServiceRequest {
  userId: string
  discount: string
  coupon_code: string
  active: boolean
  validation_date: Date
}

interface CreateCouponStoreServiceResponse {
  newCouponCreated: StoreCoupon
}

export default class CreateCouponStoreService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeCouponRepository: StoreCouponRepository
  ) {}

  async handle({
    active,
    coupon_code,
    discount,
    userId,
    validation_date,
  }: CreateCouponStoreServiceRequest): Promise<CreateCouponStoreServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    } else if (
      !discount ||
      !coupon_code ||
      active === null ||
      active === undefined ||
      !validation_date
    ) {
      throw {
        status: 403,
        error:
          "Invalid coupon informations. You must provide discount, coupon code, is coupon active and validation date.",
      }
    }

    const getUser = await this.userRepository.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getStore = await this.storeRepository.findUserStore(getUser.email)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    }

    const newCoupon = {
      storeId: getStore.id,
      discount,
      coupon_code,
      active,
      validation_date,
    }

    const checkIfStoreHasAnCouponWithThatCode =
      await this.storeCouponRepository.findByCouponCode(getStore.id, coupon_code)

    if (checkIfStoreHasAnCouponWithThatCode) {
      throw {
        status: 409,
        error: "An coupon with that code already exists on this store.",
      }
    }

    const newCouponCreated = await this.storeCouponRepository.insert(newCoupon)

    return { newCouponCreated }
  }
}
