import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import GetUserProfileService from "../../user/getUserProfileService"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"

let inMemoryUser: InMemoryUser
let inMemoryStore: InMemoryStore
let inMemoryStoreCoin: InMemoryStoreCoin

let registerNewUserService: RegisterNewUserServices
let sut: GetUserProfileService

describe("Get user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreCoin = new InMemoryStoreCoin()

    registerNewUserService = new RegisterNewUserServices(inMemoryUser)
    sut = new GetUserProfileService(inMemoryUser, inMemoryStore, inMemoryStoreCoin)

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
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [],
        }),
      })
    )
  })

  it("should be possible to get an user profile with an store.", async () => {
    const { id: storeId } = await inMemoryStore.create(
      "test@email.com",
      "storeTest",
      "storeCoinTest",
      "test description"
    )

    await inMemoryStoreCoin.createStoreCoin("storeCoinTest", storeId)

    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [],
        }),
        store: expect.objectContaining({
          id: expect.any(String),
          name: "storeTest",
          storeOwner: "test@email.com",
          description: "test description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "storeCoinTest",
            fkstore_coin_owner: storeId,
          }),
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
