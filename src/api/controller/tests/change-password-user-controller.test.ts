import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Change user password controller", () => {
  afterAll(() => {
    server.close()
  })

  beforeAll(async () => {
    await request(app).post("/register").send({
      email: "test@test.com.br",
      password: "123456",
      username: "admin",
    })
  })

  it("should be possible to change an user password", async () => {
    const updatePassword = await request(app).patch("/new-password").send({
      email: "test@test.com.br",
      newPassword: "newpass1234",
    })

    expect(updatePassword.statusCode).toEqual(200)
  })

  it("should not be possible to change an user password if email or new password are not provided", async () => {
    const updatePassword = await request(app).patch("/new-password").send({
      email: "test@test.com.br",
      newPassword: "",
    })

    expect(updatePassword.statusCode).toEqual(422)
    expect(updatePassword.body).toEqual(
      expect.objectContaining({
        validationErrors: true,
        errors: {
          newPassword: "Must have at least 6 characters.",
        },
      })
    )
  })

  it("should not be possible to change an user password if new password has less than 6 characters", async () => {
    const updatePassword = await request(app).patch("/new-password").send({
      email: "test@test.com.br",
      newPassword: "12345",
    })

    expect(updatePassword.statusCode).toEqual(422)
    expect(updatePassword.body).toEqual(
      expect.objectContaining({
        validationErrors: true,
        errors: {
          newPassword: "Must have at least 6 characters.",
        },
      })
    )
  })

  it("should not be possible to change an user password if user doesnt exists", async () => {
    const updatePassword = await request(app).patch("/new-password").send({
      email: "inexistent@inexistent.com.br",
      newPassword: "123456",
    })

    expect(updatePassword.statusCode).toEqual(404)
    expect(updatePassword.body.message).toEqual("User not found.")
  })
})
