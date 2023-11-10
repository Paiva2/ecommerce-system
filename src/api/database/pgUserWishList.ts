import { randomUUID } from "crypto"
import prisma from "../../lib/prisma"
import { UserWishList } from "../@types/types"
import UserWishListRepository from "../repositories/UserWishListRepository"

export default class PgUserWishList implements UserWishListRepository {
  private schema = process.env.DATABASE_SCHEMA

  async create(userId: string) {
    const [newUserWishList] = await prisma.$queryRawUnsafe<UserWishList[]>(
      `
        INSERT INTO "${this.schema}".user_wishlist
        ("id", "fkwishlist_owner") VALUES 
        ($1, $2)
        RETURNING *
        `,
      randomUUID(),
      userId
    )

    return newUserWishList
  }

  async getUserWishList(userId: string) {
    const [userWishList] = await prisma.$queryRawUnsafe<UserWishList[]>(
      `
        SELECT * FROM "${this.schema}".user_wishlist
        WHERE fkwishlist_owner = $1
        `,
      userId
    )

    return userWishList
  }
}
