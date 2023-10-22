import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import GetUserProfileService from "../../user/getUserProfileService"
import InMemoryStore from "../../../in-memory/inMemoryStore"

let inMemoryUser: InMemoryUser
let inMemoryStore: InMemoryStore
let registerNewUserService: RegisterNewUserServices
let sut: GetUserProfileService

describe("Get user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()

    registerNewUserService = new RegisterNewUserServices(inMemoryUser)
    sut = new GetUserProfileService(inMemoryUser, inMemoryStore)

    await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })
  })

  it("should be possible to get an user profile without an store.", async () => {
    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        store: {},
      })
    )
  })

  it("should be possible to get an user profile with an store.", async () => {
    await inMemoryStore.create("test@email.com", "storeTest")

    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        store: expect.objectContaining({
          id: expect.any(String),
          name: "storeTest",
          storeOwner: "test@email.com",
        }),
      })
    )
  })

  it("should not be possible to get an user profile without an valid email.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide user an valid user email.",
      })
    )
  })

  it("should not be possible to get an user profile if user doesnt exists on database.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "inexistent@inexistent.com.br",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})