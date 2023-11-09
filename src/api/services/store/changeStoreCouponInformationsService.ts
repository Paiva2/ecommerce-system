import { StoreCoupon } from "../../@types/types"
import StoreCouponRepository from "../../repositories/StoreCouponRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import { UserRepository } from "../../repositories/UserRepository"

interface ChangeStoreCouponInformationsServiceRequest {
  userId: string
  couponId: string
  infosToUpdate: {
    discount?: string
    coupon_code?: string
    active?: boolean
    validation_date?: Date
  }
}

interface ChangeStoreCouponInformationsServiceResponse {
  storeCouponUpdated?: StoreCoupon
  getStoreCoupon?: StoreCoupon
}

export default class ChangeStoreCouponInformationsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
    private storeCouponRepository: StoreCouponRepository
  ) {}

  async execute({
    userId,
    couponId,
    infosToUpdate,
  }: ChangeStoreCouponInformationsServiceRequest): Promise<ChangeStoreCouponInformationsServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    } else if (!couponId) {
      throw {
        status: 403,
        error: "Invalid coupon id.",
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

    const getStoreCoupon = await this.storeCouponRepository.findCouponById(
      getStore.id,
      couponId
    )

    if (!getStoreCoupon) {
      throw {
        status: 404,
        error: "Store coupon not found.",
      }
    }

    if (!Object.keys(infosToUpdate).length) {
      return { getStoreCoupon }
    }

    const storeCouponUpdated =
      await this.storeCouponRepository.updateCouponInformations(
        getStore.id,
        couponId,
        infosToUpdate
      )

    return { storeCouponUpdated }
  }
}
