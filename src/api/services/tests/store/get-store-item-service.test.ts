import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import { Store } from "../../../@types/types"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"
import GetStoreItemService from "../../store/getStoreItemService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let createNewStoreService: CreateNewStoreService
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem

let addNewItemToStoreListService: AddNewItemToStoreListService
let sut: GetStoreItemService

let storeCreated: Store

const mockNewItem = {
  itemName: "Brown Shoe",
  value: 200,
  quantity: 1,
  description: "Fashion brown shoe",
  promotion: false,
  promotionalValue: null,
  itemImage: null,
  colors: "blue;brown;green;red",
  sizes: "xg;xl;sm",
}

const userTest = {
  email: "test@test.com",
  username: "test user",
  password: "1234567",
}

describe.only("Get store item service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreItem = new InMemoryStoreItem()

    addNewItemToStoreListService = new AddNewItemToStoreListService(
      inMemoryStore,
      inMemoryStoreItem,
      inMemoryStoreCoin
    )

    createNewStoreService = new CreateNewStoreService(
      inMemoryStore,
      inMemoryUser,
      inMemoryStoreCoin
    )

    sut = new GetStoreItemService(inMemoryStoreItem, inMemoryStore)

    await inMemoryUser.insert(userTest.email, userTest.username, userTest.password)

    const { store } = await createNewStoreService.execute({
      storeCoin: "my coin",
      storeName: "store 1",
      storeOwner: userTest.email,
      storeDescription: "store desc",
    })

    storeCreated = store
  })

  it("should be possible to get store item by store id and item id.", async () => {
    const { newItemListCreation } = await addNewItemToStoreListService.handle({
      itemList: Array(mockNewItem),
      userEmail: userTest.email,
    })

    const { storeItem } = await sut.execute({
      itemId: newItemListCreation[0].id,
      storeId: storeCreated.id,
    })

    expect(storeItem).toEqual(
      expect.objectContaining({
        storeName: "store 1",
        storeOwner: userTest.email,
        storeCoin: "my coin",
        storeItem: {
          id: newItemListCreation[0].id,
          item_name: "Brown Shoe",
          value: 200,
          quantity: 1,
          description: "Fashion brown shoe",
          fkstore_id: storeCreated.id,
          fkstore_coin: "my coin",
          colors: "blue;brown;green;red",
          sizes: "xg;xl;sm",
          item_image: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          promotion: false,
          promotional_value: null,
        },
      })
    )
  })

  it("should not be possible to get an item by its id if store id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        storeId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid store id.",
      })
    )
  })

  it("should not be possible to get an item by its id if item id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: null,
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid item id.",
      })
    )
  })

  it("should not be possible to get an item by its id if store doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        storeId: "inexistent store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store id not found.",
      })
    )
  })

  it("should not be possible to get an item by its id if item doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "inexistent item id",
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Item id not found.",
      })
    )
  })
})
