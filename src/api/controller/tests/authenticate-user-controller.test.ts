import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Authenticate user controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to authenticate a user", async () => {
    await request(app).post("/register").send({
      email: "admin@admin.com.br",
      password: "123456",
      username: "admin",
    })

    const authUser = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    const voucherToken = authUser.headers["set-cookie"][0].split(";")

    const checkTokenExistence = voucherToken[0].includes("voucher-token")

    expect(checkTokenExistence).toBe(true)
    expect(authUser.statusCode).toEqual(200)
  })

  it("should not be possible to authenticated if any information are not provided", async () => {
    const authUser = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "",
    })

    expect(authUser.statusCode).toEqual(409)
    expect(authUser.body.message).toEqual(
      "You must provide all user informations. E-mail and Password."
    )
  })

  it("should not be possible to authenticate if user is not registered", async () => {
    const authUser = await request(app).post("/login").send({
      email: "inexistent@inexistent.com.br",
      password: "123456",
    })

    expect(authUser.statusCode).toEqual(404)
    expect(authUser.body.message).toEqual("User not found.")
  })

  it("should not be possible to authenticate if password or email are incorrect", async () => {
    await request(app).post("/register").send({
      email: "incorrect@incorrect.com.br",
      password: "123456",
      username: "admin",
    })

    const authUser = await request(app).post("/login").send({
      email: "incorrect@incorrect.com.br",
      password: "incorrect password",
    })

    expect(authUser.statusCode).toEqual(403)
    expect(authUser.body.message).toEqual("Invalid credentials.")
  })
})
