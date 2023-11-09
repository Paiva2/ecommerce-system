import { describe, it, beforeEach, expect, vi } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreCoupon from "../../../in-memory/inMemoryStoreCoupon"
import CreateNewStoreService from "../../store/createNewStoreService"
import CreateCouponStoreService from "../../store/createCouponStoreService"
import { Store, User } from "../../../@types/types"
import ListAllUserStoreCouponsService from "../../user/listAllUserStoreCoupons"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreCoupon: InMemoryStoreCoupon

let userCreated: User
let storeCreated: Store
let createNewStoreService: CreateNewStoreService
let createCouponStoreService: CreateCouponStoreService

let sut: ListAllUserStoreCouponsService

describe("List all user store coupons", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreCoupon = new InMemoryStoreCoupon()

    sut = new ListAllUserStoreCouponsService(
      inMemoryUser,
      inMemoryStore,
      inMemoryStoreCoupon
    )

    createCouponStoreService = new CreateCouponStoreService(
      inMemoryUser,
      inMemoryStore,
      inMemoryStoreCoupon
    )

    createNewStoreService = new CreateNewStoreService(
      inMemoryStore,
      inMemoryUser,
      inMemoryStoreCoin
    )

    const newUser = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    userCreated = await inMemoryUser.insert(
      newUser.email,
      newUser.username,
      newUser.password
    )

    const { store } = await createNewStoreService.execute({
      storeName: "test user",
      storeOwner: "test@test.com",
      storeCoin: "mycointest",
      storeDescription: "this is my description",
    })

    storeCreated = store
  })

  it("should be possible to list all user store coupons.", async () => {
    await createCouponStoreService.handle({
      active: true,
      coupon_code: "FIRST COUPON",
      discount: "30",
      userId: userCreated.id,
      validation_date: new Date(),
    })

    await createCouponStoreService.handle({
      active: false,
      coupon_code: "SECOND COUPON",
      discount: "20",
      userId: userCreated.id,
      validation_date: new Date(),
    })

    const { storeCoupons } = await sut.execute({
      userId: userCreated.id,
    })

    expect(storeCoupons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          discount: "30",
          coupon_code: "FIRST COUPON",
          fkcoupon_owner: storeCreated.id,
          active: true,
          created_At: expect.any(Date),
          updated_at: expect.any(Date),
          validation_date: expect.any(Date),
        }),
        expect.objectContaining({
          id: expect.any(String),
          discount: "20",
          coupon_code: "SECOND COUPON",
          fkcoupon_owner: storeCreated.id,
          active: false,
          created_At: expect.any(Date),
          updated_at: expect.any(Date),
          validation_date: expect.any(Date),
        }),
      ])
    )
  })

  it("should not be possible to list all user store coupons without an user id provided.", async () => {
    await expect(() => {
      return sut.execute({
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to list all user store coupons if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        userId: "inexistent user",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to list all user store coupons if user has no store created.", async () => {
    const userCreated = await inMemoryUser.insert(
      "test@email.com",
      "123456",
      "test user"
    )

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User has no store created.",
      })
    )
  })
})
