import { describe, it, expect, afterAll, beforeAll, vi } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Create coupon store controller", () => {
  beforeAll(async () => {
    await request(app).post("/register").send({
      email: "admin@admin.com.br",
      password: "123456",
      username: "admin",
    })
  })

  afterAll(() => {
    server.close()
  })

  it("should be possible to create a new store coupon", async () => {
    vi.useFakeTimers()

    const fakeCouponDate = new Date(2050, 1, 1, 13)

    vi.setSystemTime(fakeCouponDate)

    const validationDateMock = new Date(Date.now())

    vi.useRealTimers()

    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    const couponCreation = await request(app)
      .post("/new-coupon")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        validation_date: validationDateMock,
      })

    const profile = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const convertValidationMockDate = String(validationDateMock)

    const getCouponValidationDate = String(
      new Date(profile.body.data.store.store_coupon[0].validation_date)
    )

    expect(couponCreation.statusCode).toBe(201)
    expect(getCouponValidationDate).toEqual(convertValidationMockDate)
    expect(profile.body.data.store.store_coupon).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        discount: "20",
        coupon_code: "TEST",
        fkcoupon_owner: profile.body.data.store.id,
        active: true,
        created_At: expect.any(String),
        updated_at: expect.any(String),
      }),
    ])
  })

  it("should be possible to create a new store coupon is store already has one with that name.", async () => {
    await request(app).post("/register").send({
      email: "admin2@admin2.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin2@admin2.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store2",
        storeDescription: "test store description",
        storeCoin: "mycoinname2",
      })

    await request(app)
      .post("/new-coupon")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        validation_date: new Date(),
      })

    const couponCreation = await request(app)
      .post("/new-coupon")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        validation_date: new Date(),
      })

    expect(couponCreation.statusCode).toBe(409)
    expect(couponCreation.body.message).toEqual(
      "An coupon with that code already exists on this store."
    )
  })

  it("should not be possible to create a new store coupon without auth", async () => {
    const couponCreation = await request(app).post("/new-coupon").send({
      active: true,
      coupon_code: "TEST",
      discount: "20",
      validation_date: new Date(),
    })

    expect(couponCreation.statusCode).toBe(403)
    expect(couponCreation.body.message).toEqual("Invalid token.")
  })
})
