import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Create new store controller", () => {
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

  it("should be possible to create a new store for an user", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    const storeCreation = await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    expect(storeCreation.statusCode).toBe(201)

    const res = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(res.body.data).toEqual(
      expect.objectContaining({
        store: {
          id: expect.any(String),
          name: "test store",
          created_At: expect.any(String),
          updated_at: expect.any(String),
          storeOwner: "admin@admin.com.br",
          description: "test store description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "mycoinname",
            fkstore_coin_owner: expect.any(String),
          }),
        },
      })
    )
  })

  it("should not be possible to create a new store for an user if store coin already exists.", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    await request(app) // first store creation
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    await request(app).post("/register").send({
      email: "secondstoreuser@test.com.br",
      password: "123456",
      username: "test",
    })

    const loginOnSecondAcc = await request(app).post("/login").send({
      email: "secondstoreuser@test.com.br",
      password: "123456",
    })

    const secondStoreCreation = await request(app) // second store creation
      .post("/store")
      .set("Cookie", loginOnSecondAcc.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    expect(secondStoreCreation.statusCode).toEqual(409)
    expect(secondStoreCreation.body.message).toEqual(
      "An store coin with this name is already registered."
    )
  })

  it("should not be possible to create a new store for a user without auth token", async () => {
    const res = await request(app).post("/store").send({
      storeName: "test store",
    })

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe("Invalid token.")
  })

  it("should not be possible to create a new store for an user if this user already has one store", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeCoin: "mycoinname",
      })

    const storeCreation = await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "other store",
        storeCoin: "mycoinname",
      })

    expect(storeCreation.statusCode).toBe(403)
    expect(storeCreation.body.message).toBe("User already has an store.")
  })

  it("should not be possible to create a new store for an user if store coin or store name are not provided.", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    const storeCreation = await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "",
        storeCoin: "",
      })

    expect(storeCreation.statusCode).toBe(422)
    expect(storeCreation.body).toEqual(
      expect.objectContaining({
        validationErrors: true,
        errors: {
          storeName: "Can't be empty.",
          storeCoin: "Can't be empty.",
        },
      })
    )
  })
})
