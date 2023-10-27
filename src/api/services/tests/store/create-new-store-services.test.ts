import { describe, it, beforeEach, expect, beforeAll } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let sut: CreateNewStoreService

describe("Create new store service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    sut = new CreateNewStoreService(inMemoryStore, inMemoryUser)

    const newUser = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    await inMemoryUser.insert(newUser.email, newUser.username, newUser.password)
  })

  it("should be possible to create a new store.", async () => {
    const { store } = await sut.execute({
      storeName: "test user",
      storeOwner: "test@test.com",
      storeCoin: "mycointest",
      storeDescription: "this is my description",
    })

    expect(store).toEqual({
      id: expect.any(String),
      name: "test user",
      storeOwner: "test@test.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      description: "this is my description",
      store_coin: expect.objectContaining({
        id: expect.any(String),
        store_coin_name: "mycointest",
        updated_At: expect.any(Date),
        created_At: expect.any(Date),
        fkstore_coin_owner: store.id,
      }),
    })
  })

  it("should not be possible to create a new store if name and owner name are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        storeName: "",
        storeOwner: "",
        storeCoin: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide all informations. Store name and store owner.",
      })
    )
  })

  it("should not be possible to create a new store if store owner are not registered.", async () => {
    await expect(() => {
      return sut.execute({
        storeName: "inexistent",
        storeOwner: "inexistent@inexistent.com",
        storeCoin: "mycointest",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store owner not found (e-mail).",
      })
    )
  })

  it("should not be possible to create a new store if user already has one store.", async () => {
    await sut.execute({
      storeName: "test user",
      storeOwner: "test@test.com",
      storeCoin: "mycointest",
    })

    await expect(() => {
      return sut.execute({
        storeName: "test user",
        storeOwner: "test@test.com",
        storeCoin: "mycointest",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User already has an store.",
      })
    )
  })
})
