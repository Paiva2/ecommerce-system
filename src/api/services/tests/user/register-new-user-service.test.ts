import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import { compare } from "bcryptjs"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryUserWishList from "../../../in-memory/inMemoryUserWishList"

let inMemoryUser: InMemoryUser
let inMemoryWallet: InMemoryWallet
let inMemoryUserWishList: InMemoryUserWishList

let sut: RegisterNewUserServices

describe("Register new user service", () => {
  beforeEach(() => {
    inMemoryUser = new InMemoryUser()
    inMemoryWallet = new InMemoryWallet()
    inMemoryUserWishList = new InMemoryUserWishList()

    sut = new RegisterNewUserServices(
      inMemoryUser,
      inMemoryWallet,
      inMemoryUserWishList
    )
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
        userWishList: {
          id: expect.any(String),
          fkwishlist_owner: newUser.id,
          items: [],
        },
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: newUser.id,
          coins: [],
        }),
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
