import { randomUUID } from "crypto"
import prisma from "../../lib/prisma"
import { StoreCoupon, StoreCouponUpdate } from "../@types/types"
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

  async findCouponById(storeId: string, couponId: string) {
    const [storeCoupon] = await prisma.$queryRawUnsafe<StoreCoupon[]>(
      `
      SELECT * FROM "${this.schema}".store_coupon
      WHERE id = $2 AND fkcoupon_owner = $1
  `,
      storeId,
      couponId
    )

    return storeCoupon
  }

  async updateCouponInformations(
    storeId: string,
    couponId: string,
    infosToUpdate: StoreCouponUpdate
  ) {
    const fieldsToUpdate = Object.keys(infosToUpdate)
    const querySets = []

    for (let field of fieldsToUpdate) {
      if (infosToUpdate[field] !== null) {
        if (field === "active") {
          querySets.push(`${field} = CAST('${infosToUpdate[field]}' as boolean)`)
        } else if (infosToUpdate[field] !== null) {
          querySets.push(`${field} = '${infosToUpdate[field]}'`)
        }
      }
    }

    const [storeCouponUpdated] = await prisma.$queryRawUnsafe<StoreCoupon[]>(
      `
        UPDATE "${this.schema}".store_coupon
        SET ${querySets.toString()}, updated_at = $3
        WHERE id = $1 and fkcoupon_owner = $2
        RETURNING *
      `,
      couponId,
      storeId,
      new Date()
    )

    return storeCouponUpdated
  }
}
