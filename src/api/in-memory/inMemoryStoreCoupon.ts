import { randomUUID } from "crypto"
import { StoreCoupon, StoreCouponUpdate } from "../@types/types"
import StoreCouponRepository from "../repositories/StoreCouponRepository"

export default class InMemoryStoreCoupon implements StoreCouponRepository {
  private storeCoupons: StoreCoupon[] = []

  async insert({ storeId, discount, coupon_code, active, validation_date }) {
    const newCoupon = {
      id: randomUUID(),
      discount,
      coupon_code,
      fkcoupon_owner: storeId,
      active,
      created_At: new Date(),
      updated_at: new Date(),
      validation_date,
    }

    this.storeCoupons.push(newCoupon)

    return newCoupon
  }

  async findByCouponCode(storeId: string, couponCode: string) {
    const findStoreCoupon = this.storeCoupons.find(
      (coupon) =>
        coupon.fkcoupon_owner === storeId && coupon.coupon_code === couponCode
    )

    if (!findStoreCoupon) return null

    return findStoreCoupon
  }

  async findStoreCoupons(storeId: string) {
    const storeCoupons = this.storeCoupons.filter(
      (coupon) => coupon.fkcoupon_owner === storeId
    )

    return storeCoupons
  }

  async findCouponById(storeId: string, couponId: string) {
    const getStoreCoupon = this.storeCoupons.find(
      (coupon) => coupon.id === couponId && coupon.fkcoupon_owner === storeId
    )

    if (!getStoreCoupon) {
      return null
    }

    return getStoreCoupon
  }

  async updateCouponInformations(
    storeId: string,
    couponId: string,
    infosToUpdate: StoreCouponUpdate
  ) {
    const fieldsToUpdate = Object.keys(infosToUpdate)

    let storeCouponUpdated: StoreCoupon

    const getCurrentCouponInfos = this.storeCoupons.find((coupon) => {
      return coupon.id === couponId && coupon.fkcoupon_owner === storeId
    })

    const getStoreCouponIndex = this.storeCoupons.indexOf(getCurrentCouponInfos)

    fieldsToUpdate.forEach((field) => {
      storeCouponUpdated = {
        ...getCurrentCouponInfos,
        ...storeCouponUpdated,
        updated_at: new Date(),
        [field]: infosToUpdate[field],
      }
    })

    this.storeCoupons.splice(getStoreCouponIndex, 1, storeCouponUpdated)

    return storeCouponUpdated
  }
}
