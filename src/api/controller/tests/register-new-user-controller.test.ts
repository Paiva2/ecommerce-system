import { describe, it, expect, afterAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Register new user controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to register a new user", async () => {
    const newUser = await request(app).post("/register").send({
      email: "admin@admin.com.br",
      password: "123456",
      username: "admin",
    })

    expect(newUser.statusCode).toEqual(201)
  })

  it("should not be possible to register a new user if any parameter are not provided", async () => {
    const newUser = await request(app).post("/register").send({
      email: "",
      password: "123456",
      username: "admin",
    })

    expect(newUser.statusCode).toEqual(409)
    expect(newUser.body.message).toEqual(
      "You must provide all informations. Username, email and password."
    )
  })

  it("should not be possible to register a new user if password has less than 6 characters", async () => {
    const newUser = await request(app).post("/register").send({
      email: "test@test.com.br",
      password: "1",
      username: "admin",
    })

    expect(newUser.statusCode).toEqual(403)
    expect(newUser.body.message).toEqual("Password must have at least 6 characters.")
  })

  it("should not be possible to register a new user if user already exists.", async () => {
    await request(app).post("/register").send({
      email: "test@test.com.br",
      password: "123456",
      username: "admin",
    })

    const newUser = await request(app).post("/register").send({
      email: "test@test.com.br",
      password: "123456",
      username: "admin",
    })

    expect(newUser.statusCode).toEqual(409)
    expect(newUser.body.message).toEqual("User is already registered.")
  })
})
