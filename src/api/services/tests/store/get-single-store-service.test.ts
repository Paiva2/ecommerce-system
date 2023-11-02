import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import GetSingleStoreService from "../../store/getSingleStoreService"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import { Store } from "../../../@types/types"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let createNewStoreService: CreateNewStoreService
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem

let sut: GetSingleStoreService

let storeCreated: Store

const userTest = {
  email: "test@test.com",
  username: "test user",
  password: "1234567",
}

describe("Get single store service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreItem = new InMemoryStoreItem()

    createNewStoreService = new CreateNewStoreService(
      inMemoryStore,
      inMemoryUser,
      inMemoryStoreCoin
    )

    sut = new GetSingleStoreService(
      inMemoryStore,
      inMemoryStoreCoin,
      inMemoryStoreItem
    )

    await inMemoryUser.insert(userTest.email, userTest.username, userTest.password)

    const { store } = await createNewStoreService.execute({
      storeCoin: "my coin",
      storeName: "store 1",
      storeOwner: userTest.email,
      storeDescription: "store desc",
    })

    storeCreated = store
  })

  it("should be possible to get one single store by id.", async () => {
    const { store } = await sut.execute({
      storeId: storeCreated.id,
    })

    expect(store).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "store 1",
        storeOwner: userTest.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "store desc",
        store_coin: expect.objectContaining({
          id: expect.any(String),
          created_At: expect.any(Date),
          updated_at: expect.any(Date),
          fkstore_coin_owner: store.id,
          store_coin_name: "my coin",
        }),
        store_item: [],
      })
    )
  })

  it("should be possible to get one single store by id containing store items.", async () => {
    await inMemoryStoreItem.insert([
      {
        itemName: "first item",
        value: 200,
        quantity: 10,
        itemImage: "",
        description: "this is my first item",
        promotion: false,
        promotionalValue: null,
        storeId: storeCreated.id,
        storeCoin: "my coin",
        colors: "red;green;blue",
        sizes: "l",
      },

      {
        itemName: "second item",
        value: 300,
        quantity: 10,
        itemImage: "",
        description: "this is my second item",
        promotion: true,
        promotionalValue: 150,
        storeId: storeCreated.id,
        storeCoin: "my coin",
        colors: "black",
        sizes: "m",
      },
    ])

    const { store } = await sut.execute({
      storeId: storeCreated.id,
    })

    expect(store).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "store 1",
        storeOwner: userTest.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "store desc",
        store_coin: expect.objectContaining({
          id: expect.any(String),
          created_At: expect.any(Date),
          updated_at: expect.any(Date),
          fkstore_coin_owner: store.id,
          store_coin_name: "my coin",
        }),
        store_item: [
          {
            id: expect.any(String),
            item_name: "first item",
            value: 200,
            quantity: 10,
            item_image: "",
            description: "this is my first item",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: false,
            promotional_value: null,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            colors: "red;green;blue",
            sizes: "l",
          },

          {
            id: expect.any(String),
            item_name: "second item",
            value: 300,
            quantity: 10,
            item_image: "",
            description: "this is my second item",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: true,
            promotional_value: 150,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            colors: "black",
            sizes: "m",
          },
        ],
      })
    )
  })

  it("should not be possible to get one single store by id without store id.", async () => {
    await expect(() => {
      return sut.execute({
        storeId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid store id.",
      })
    )
  })

  it("should not be possible to get one single store by id if store doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        storeId: "inexistent store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
