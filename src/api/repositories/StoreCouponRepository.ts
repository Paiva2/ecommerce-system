import { StoreCoupon, StoreCouponUpdate } from "../@types/types"

interface StoreCouponCreation {
  storeId: string
  discount: string
  coupon_code: string
  active: boolean
  validation_date: Date
}

export default interface StoreCouponRepository {
  insert({
    storeId,
    discount,
    coupon_code,
    active,
    validation_date,
  }: StoreCouponCreation): Promise<StoreCoupon>

  findByCouponCode(storeId: string, couponCode: string): Promise<StoreCoupon | null>

  findCouponById(storeId: string, couponId: string): Promise<StoreCoupon | null>

  updateCouponInformations(
    storeId: string,
    couponId: string,
    infosToUpdate: StoreCouponUpdate
  ): Promise<StoreCoupon>

  findStoreCoupons(storeId: string): Promise<StoreCoupon[]>
}
