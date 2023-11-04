import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Get user profile controller", () => {
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

  it("should be possible to get an user profile without an store", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    const res = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(res.statusCode).toBe(200)

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "admin@admin.com.br",
        username: "admin",
        created_At: expect.any(String),
        store: {},
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          // TODO ADD COINS ARRAY
        }),
      })
    )
  })

  it("should be possible to get an user profile with an store", async () => {
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
        storeCoin: "mycointest",
      })

    const res = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "admin@admin.com.br",
        username: "admin",
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          //coins: [], TODO
        }),
        created_At: expect.any(String),
        store: expect.objectContaining({
          id: expect.any(String),
          name: "test store",
          storeOwner: "admin@admin.com.br",
          description: "test store description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "mycointest",
            fkstore_coin_owner: expect.any(String),
          }),
        }),
      })
    )
  })

  it("should not be possible to get an user profile without an auth token", async () => {
    const res = await request(app).get("/profile").send()

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe("Invalid token.")
  })
})
