import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

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

  it("should not be possible to get an user profile without an auth token", async () => {
    const res = await request(app).get("/profile").send()

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe("Invalid token.")
  })
})
