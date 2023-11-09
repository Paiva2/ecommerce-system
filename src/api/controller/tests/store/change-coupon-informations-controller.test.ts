import { describe, it, expect, afterAll, beforeAll, vi } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Change coupon informations controller", () => {
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

  it("should be possible to change an store coupon information", async () => {
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

    await request(app)
      .post("/new-coupon")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        active: true,
        coupon_code: "TEST",
        discount: "20",
        validation_date: new Date(),
      })

    const profile = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const updateCoupon = await request(app)
      .patch("/coupon")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        couponId: profile.body.data.store.store_coupon[0].id,
        infosToUpdate: {
          active: false,
          coupon_code: "TEST UPDATE",
          discount: "10",
          validation_date: validationDateMock,
        },
      })

    const profileAfterUpdate = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const validationUpdate = new Date(validationDateMock.toString())
    const newValidationDate = new Date(
      profileAfterUpdate.body.data.store.store_coupon[0].validation_date.toString()
    )

    expect(newValidationDate).toEqual(validationUpdate)
    expect(updateCoupon.statusCode).toBe(204)
    expect(profileAfterUpdate.body.data.store.store_coupon).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        discount: "10",
        coupon_code: "TEST UPDATE",
        fkcoupon_owner: profile.body.data.store.id,
        active: false,
        created_At: expect.any(String),
        updated_at: expect.any(String),
      }),
    ])
  })

  it("should not be possible to change an store coupon information without an token auth.", async () => {
    const updateCoupon = await request(app).patch("/coupon").send({
      couponId: "any coupon id",
      infosToUpdate: {},
    })

    expect(updateCoupon.statusCode).toBe(403)
    expect(updateCoupon.body.message).toEqual("Invalid token.")
  })
})
