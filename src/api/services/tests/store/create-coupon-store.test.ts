import { describe, it, beforeEach, expect, vi } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreCoupon from "../../../in-memory/inMemoryStoreCoupon"
import CreateNewStoreService from "../../store/createNewStoreService"
import CreateCouponStoreService from "../../store/createCouponStoreService"
import { Store, User } from "../../../@types/types"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreCoupon: InMemoryStoreCoupon

let userCreated: User
let storeCreated: Store
let createNewStoreService: CreateNewStoreService
let sut: CreateCouponStoreService

describe("Create Coupon Store Service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreCoupon = new InMemoryStoreCoupon()

    sut = new CreateCouponStoreService(
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

  it("should be possible to create a new store coupon.", async () => {
    vi.useFakeTimers()

    const fakeCouponDate = new Date(2050, 1, 1, 13)

    vi.setSystemTime(fakeCouponDate)

    const validationDateMock = new Date(Date.now())

    vi.useRealTimers()

    const { newCouponCreated } = await sut.handle({
      active: true,
      coupon_code: "TEST",
      discount: "20",
      userId: userCreated.id,
      validation_date: validationDateMock,
    })

    expect(newCouponCreated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        discount: "20",
        coupon_code: "TEST",
        fkcoupon_owner: storeCreated.id,
        active: true,
        created_At: expect.any(Date),
        updated_at: expect.any(Date),
        validation_date: validationDateMock,
      })
    )
  })

  it("should not be possible to create a new store coupon without user id.", async () => {
    await expect(() => {
      return sut.handle({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        userId: null,
        validation_date: new Date(),
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to create a new store coupon without necessary coupons informations.", async () => {
    await expect(() => {
      return sut.handle({
        active: null,
        coupon_code: null,
        discount: null,
        userId: userCreated.id,
        validation_date: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error:
          "Invalid coupon informations. You must provide discount, coupon code, is coupon active and validation date.",
      })
    )
  })

  it("should not be possible to create a new store coupon if user doesnt exists.", async () => {
    await expect(() => {
      return sut.handle({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        userId: "inexistent user id",
        validation_date: new Date(),
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to create a new store coupon if store doesnt exists.", async () => {
    const anyUserWithoutStore = await inMemoryUser.insert(
      "user@gmail.com",
      "user no store",
      "1234567"
    )

    await expect(() => {
      return sut.handle({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        userId: anyUserWithoutStore.id,
        validation_date: new Date(),
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
