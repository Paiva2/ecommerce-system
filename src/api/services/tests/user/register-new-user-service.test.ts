import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import { compare } from "bcryptjs"

let inMemoryUser: InMemoryUser
let sut: RegisterNewUserServices

describe("Register new user service", () => {
  beforeEach(() => {
    inMemoryUser = new InMemoryUser()
    sut = new RegisterNewUserServices(inMemoryUser)
  })

  it("should be possible to register a new user.", async () => {
    const { newUser } = await sut.execute({
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

  it("should not be possible to register a new user if email already exists.", async () => {
    await sut.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    await expect(() => {
      return sut.execute({
        email: "test@email.com",
        username: "test user",
        password: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User is already registered.",
      })
    )
  })

  it("should not be possible to register a new user if any parameter are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
        username: "test user",
        password: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide all informations. Username, email and password.",
      })
    )
  })

  it("should not be possible to register a new user if password has less than 6 characters.", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com.br",
        username: "test user",
        password: "12345",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Password must have at least 6 characters.",
      })
    )
  })
})
