import { describe, it, beforeEach, expect, vi } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreCoupon from "../../../in-memory/inMemoryStoreCoupon"
import CreateNewStoreService from "../../store/createNewStoreService"
import CreateCouponStoreService from "../../store/createCouponStoreService"
import { Store, User } from "../../../@types/types"
import ChangeStoreCouponInformationsService from "../../store/changeStoreCouponInformationsService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreCoupon: InMemoryStoreCoupon

let userCreated: User
let storeCreated: Store
let createNewStoreService: CreateNewStoreService
let createCouponStoreService: CreateCouponStoreService

let sut: ChangeStoreCouponInformationsService

describe("Change store coupon informations service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreCoupon = new InMemoryStoreCoupon()

    sut = new ChangeStoreCouponInformationsService(
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

  it("should be possible to update an store coupon informations.", async () => {
    vi.useFakeTimers()

    const fakeCouponDate = new Date(2040, 2, 1, 10)

    vi.setSystemTime(fakeCouponDate)

    const validationDateMock = new Date(Date.now())

    vi.useRealTimers()

    const { newCouponCreated } = await createCouponStoreService.handle({
      active: true,
      coupon_code: "TEST",
      discount: "20",
      userId: userCreated.id,
      validation_date: new Date(),
    })

    const { storeCouponUpdated } = await sut.execute({
      couponId: newCouponCreated.id,
      userId: userCreated.id,
      infosToUpdate: {
        active: false,
        coupon_code: "UPDATE",
        discount: "10",
        validation_date: validationDateMock,
      },
    })

    expect(storeCouponUpdated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        active: false,
        discount: "10",
        coupon_code: "UPDATE",
        fkcoupon_owner: storeCreated.id,
        created_At: expect.any(Date),
        updated_at: expect.any(Date),
        validation_date: validationDateMock,
      })
    )
  })

  it("should not be possible to update an store coupon informations without user id.", async () => {
    await expect(() => {
      return sut.execute({
        couponId: "any coupon id",
        userId: null,
        infosToUpdate: {
          active: true,
          coupon_code: "TEST",
          discount: "20",
          validation_date: new Date(),
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to update an store coupon informations without coupon id.", async () => {
    await expect(() => {
      return sut.execute({
        couponId: null,
        userId: userCreated.id,
        infosToUpdate: {
          active: true,
          coupon_code: "TEST",
          discount: "20",
          validation_date: new Date(),
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid coupon id.",
      })
    )
  })

  it("should not be possible to update an store coupon informations if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        couponId: "any coupon id",
        userId: "inexistent user",
        infosToUpdate: {
          active: true,
          coupon_code: "TEST",
          discount: "20",
          validation_date: new Date(),
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to update an store coupon informations if store doesnt exists.", async () => {
    const userWithNoStore = await inMemoryUser.insert(
      "nostore@email.com",
      "nostore",
      "123456"
    )

    await expect(() => {
      return sut.execute({
        couponId: "any coupon id",
        userId: userWithNoStore.id,
        infosToUpdate: {
          active: true,
          coupon_code: "TEST",
          discount: "20",
          validation_date: new Date(),
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })

  it("should not be possible to update an store coupon informations if store coupon doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        couponId: "inexistent coupon id",
        userId: userCreated.id,
        infosToUpdate: {
          active: true,
          coupon_code: "TEST",
          discount: "20",
          validation_date: new Date(),
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store coupon not found.",
      })
    )
  })

  it("should return current coupon if none info are provided to update.", async () => {
    const { newCouponCreated } = await createCouponStoreService.handle({
      active: true,
      coupon_code: "TEST",
      discount: "20",
      userId: userCreated.id,
      validation_date: new Date(),
    })

    const { getStoreCoupon } = await sut.execute({
      couponId: newCouponCreated.id,
      userId: userCreated.id,
      infosToUpdate: {},
    })

    expect(getStoreCoupon).toEqual(newCouponCreated)
  })
})
