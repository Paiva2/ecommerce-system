import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../user/registerNewUserService"
import { compare } from "bcryptjs"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserServices

describe("Register new user service", () => {
  beforeEach(() => {
    inMemoryUser = new InMemoryUser()
    registerNewUserService = new RegisterNewUserServices(inMemoryUser)
  })

  it("should be possible to register a new user", async () => {
    const { newUser } = await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    const doesPasswordIsCorrectlyHashed = await compare("123456", newUser.password)

    expect(doesPasswordIsCorrectlyHashed).toBe(true)
    expect(newUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    )
  })

  it("should not be possible to register a new user if email already exists", async () => {
    await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    await expect(() => {
      return registerNewUserService.execute({
        email: "test@email.com",
        username: "test user",
        password: "123456",
      })
    }).rejects.toThrowError("User is already registered.")
  })

  it("should not be possible to register a new user if any parameter are not provided", async () => {
    await expect(() => {
      return registerNewUserService.execute({
        email: "",
        username: "test user",
        password: "123456",
      })
    }).rejects.toThrowError(
      "You must provide all informations. Username, email and password."
    )
  })
})
