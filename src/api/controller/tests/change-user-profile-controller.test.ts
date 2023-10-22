import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Change user profile controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to update user profile informations (password and username)", async () => {
    await request(app).post("/register").send({
      email: "test@test.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "test@test.com.br",
      password: "123456",
    })

    const updateProfile = await request(app)
      .patch("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        username: "changed username",
        password: "newpass",
        oldPassword: "123456",
      })

    expect(updateProfile.statusCode).toBe(200)
    expect(updateProfile.body.message).toBe("Profile updated.")

    const loginAfterUpdate = await request(app).post("/login").send({
      email: "test@test.com.br",
      password: "newpass",
    })

    const checkProfile = await request(app)
      .get("/profile")
      .set("Cookie", loginAfterUpdate.headers["set-cookie"][0])
      .send()

    expect(loginAfterUpdate.statusCode).toBe(200)
    expect(checkProfile.body.data).toEqual(
      expect.objectContaining({
        username: "changed username",
      })
    )
  })

  it("should be possible to update user profile only username", async () => {
    await request(app).post("/register").send({
      email: "test2@test2.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "test2@test2.com.br",
      password: "123456",
    })

    const updateProfile = await request(app)
      .patch("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        username: "changed username",
      })

    expect(updateProfile.statusCode).toBe(200)
    expect(updateProfile.body.message).toBe("Profile updated.")

    const loginAfterUpdate = await request(app).post("/login").send({
      email: "test@test.com.br",
      password: "newpass",
    })

    const checkProfile = await request(app)
      .get("/profile")
      .set("Cookie", loginAfterUpdate.headers["set-cookie"][0])
      .send()

    expect(loginAfterUpdate.statusCode).toBe(200)
    expect(checkProfile.body.data).toEqual(
      expect.objectContaining({
        username: "changed username",
      })
    )
  })

  it("should be possible to update user profile only password", async () => {
    await request(app).post("/register").send({
      email: "test3@test3.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "test3@test3.com.br",
      password: "123456",
    })

    const updateProfile = await request(app)
      .patch("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        password: "newpass",
        oldPassword: "123456",
      })

    expect(updateProfile.statusCode).toBe(200)
    expect(updateProfile.body.message).toBe("Profile updated.")

    const loginAfterUpdate = await request(app).post("/login").send({
      email: "test@test.com.br",
      password: "newpass",
    })

    expect(loginAfterUpdate.statusCode).toBe(200)
  })

  it("should not be possible to update user profile without an valid auth token", async () => {
    const updateProfile = await request(app).patch("/profile").send({
      username: "changed username",
      password: "newpass",
      oldPassword: "123456",
    })

    expect(updateProfile.statusCode).toBe(403)
    expect(updateProfile.body.message).toBe("Invalid token.")
  })

  it("should not be possible to update user profile if old password dont match", async () => {
    await request(app).post("/register").send({
      email: "test5@test5.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "test5@test5.com.br",
      password: "123456",
    })

    const updateProfile = await request(app)
      .patch("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        username: "changed username",
        password: "newpass",
        oldPassword: "wrong old pass",
      })

    expect(updateProfile.statusCode).toBe(403)
    expect(updateProfile.body.message).toBe("Invalid old password.")
  })
})
