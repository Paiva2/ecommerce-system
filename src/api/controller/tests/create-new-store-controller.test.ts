import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

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
          updated_At: expect.any(String),
          fkstore_owner: "admin@admin.com.br",
        },
      })
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
      })

    const storeCreation = await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "other store",
      })

    expect(storeCreation.statusCode).toBe(403)
    expect(storeCreation.body.message).toBe("User already has an store.")
  })
})
