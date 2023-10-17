import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../user/registerNewUserService"
import AuthenticateUserService from "../user/authenticateUserService"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserServices
let authenticateUserService: AuthenticateUserService

describe("Authenticate user service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    registerNewUserService = new RegisterNewUserServices(inMemoryUser)
    authenticateUserService = new AuthenticateUserService(inMemoryUser)

    await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })
  })

  it("should be possible to authenticate an existing user.", async () => {
    const { isThisUserRegistered } = await authenticateUserService.execute({
      email: "test@email.com",
      password: "123456",
    })

    expect(isThisUserRegistered).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "test@email.com",
        password: expect.any(String),
        username: "test user",
      })
    )
  })

  it("should not be possible to authenticate an existing user if email or password are not provided.", async () => {
    await expect(() => {
      return authenticateUserService.execute({
        email: "",
        password: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide all user informations. E-mail and Password.",
      })
    )
  })

  it("should not be possible to authenticate if email doesnt exists on database.", async () => {
    await expect(() => {
      return authenticateUserService.execute({
        email: "inexistent@any.com",
        password: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to authenticate if password does not match.", async () => {
    await expect(() => {
      return authenticateUserService.execute({
        email: "test@email.com",
        password: "non matching password",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid credentials.",
      })
    )
  })
})
