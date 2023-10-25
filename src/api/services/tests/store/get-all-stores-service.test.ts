import { describe, it, beforeEach, expect, beforeAll } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import GetAllStoresService from "../../store/getAllStoresService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let createNewStoreService: CreateNewStoreService
let sut: GetAllStoresService

describe("Get all stores service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()

    createNewStoreService = new CreateNewStoreService(inMemoryStore, inMemoryUser)
    sut = new GetAllStoresService(inMemoryStore)

    const newUser = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    const newUserTwo = {
      email: "test2@test2.com",
      username: "test user2",
      password: "1234567",
    }

    await inMemoryUser.insert(newUser.email, newUser.username, newUser.password)
    await inMemoryUser.insert(
      newUserTwo.email,
      newUserTwo.username,
      newUserTwo.password
    )
  })

  it("should be possible to get all created stores.", async () => {
    await createNewStoreService.execute({
      storeName: "First store",
      storeOwner: "test@test.com",
      storeCoin: "mycointest",
    })

    await createNewStoreService.execute({
      storeName: "Second store",
      storeOwner: "test2@test2.com",
      storeCoin: "mycointest2",
    })

    const { stores } = await sut.execute()

    expect(stores.length).toEqual(2)
    expect(stores).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "First store",
          storeOwner: "test@test.com",
          store_coin: "mycointest",
        }),

        expect.objectContaining({
          name: "Second store",
          storeOwner: "test2@test2.com",
          store_coin: "mycointest2",
        }),
      ])
    )
  })

  it("should be possible to get all created stores even if there are no stores created.", async () => {
    const { stores } = await sut.execute()

    expect(stores.length).toEqual(0)
    expect(stores).toEqual([])
  })
})
