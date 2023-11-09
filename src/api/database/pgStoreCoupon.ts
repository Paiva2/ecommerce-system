import { randomUUID } from "crypto"
import prisma from "../../lib/prisma"
import { StoreCoupon } from "../@types/types"
import StoreCouponRepository from "../repositories/StoreCouponRepository"

export default class PgStoreCoupon implements StoreCouponRepository {
  private schema = process.env.DATABASE_SCHEMA

  async insert({ storeId, discount, coupon_code, active, validation_date }) {
    const [storeCoupon] = await prisma.$queryRawUnsafe<StoreCoupon[]>(
      `
        INSERT INTO "${this.schema}".store_coupon
        (id, coupon_code, fkcoupon_owner, active, discount, validation_date) 
        VALUES ($1, $2, $3, $4, CAST($5 as numeric), $6)
        RETURNING *
        `,
      randomUUID(),
      coupon_code,
      storeId,
      active,
      discount,
      new Date(validation_date)
    )

    return storeCoupon
  }

  async findByCouponCode(storeId: string, couponCode: string) {
    const [storeCoupon] = await prisma.$queryRawUnsafe<StoreCoupon[] | null>(
      `
        SELECT * FROM "${this.schema}".store_coupon
        WHERE fkcoupon_owner = $1 AND coupon_code = $2
    `,
      storeId,
      couponCode
    )

    if (!storeCoupon) return null

    return storeCoupon
  }

  async findStoreCoupons(storeId: string) {
    const storeCoupon = await prisma.$queryRawUnsafe<StoreCoupon[]>(
      `
      SELECT * FROM "${this.schema}".store_coupon
      WHERE fkcoupon_owner = $1
  `,
      storeId
    )

    return storeCoupon
  }
}
