import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import { Store } from "../../../@types/types"
import GetStoreItemListService from "../../store/getStoreItemListService"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let createNewStoreService: CreateNewStoreService
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem

let addNewItemToStoreListService: AddNewItemToStoreListService
let sut: GetStoreItemListService

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

describe("Get store item list service", () => {
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

    sut = new GetStoreItemListService(inMemoryStoreItem, inMemoryStoreCoin)

    await inMemoryUser.insert(userTest.email, userTest.username, userTest.password)

    const { store } = await createNewStoreService.execute({
      storeCoin: "my coin",
      storeName: "store 1",
      storeOwner: userTest.email,
      storeDescription: "store desc",
    })

    storeCreated = store
  })

  it("should be possible to get store item list by page.", async () => {
    await addNewItemToStoreListService.handle({
      itemList: Array(mockNewItem),
      userEmail: userTest.email,
    })

    const { storeItemList } = await sut.execute({
      storeId: storeCreated.id,
      page: 1,
    })

    expect(storeItemList).toEqual(
      expect.objectContaining({
        page: 1,
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            item_name: "Brown Shoe",
            value: 200,
            quantity: 1,
            item_image: null,
            description: "Fashion brown shoe",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: false,
            promotional_value: null,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            sizes: "xg;xl;sm",
            colors: "blue;brown;green;red",
          }),
        ]),
      })
    )
  })

  it("should be possible to get store item list by page parameter.", async () => {
    const itemList = []

    for (let i = 1; i <= 23; i++) {
      itemList.push({
        itemName: `Brown Shoe ${i}`,
        value: 200,
        quantity: 1,
        description: `Fashion brown shoe ${i}`,
        promotion: false,
        promotionalValue: null,
        itemImage: null,
        sizes: "xg;xl;sm",
        colors: "blue;brown;green;red",
      })
    }

    await addNewItemToStoreListService.handle({
      itemList: itemList,
      userEmail: userTest.email,
    })

    const { storeItemList } = await sut.execute({
      storeId: storeCreated.id,
      page: 3,
    })

    expect(storeItemList).toEqual(
      expect.objectContaining({
        page: 3,
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            item_name: "Brown Shoe 21",
            value: 200,
            quantity: 1,
            item_image: null,
            description: "Fashion brown shoe 21",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: false,
            promotional_value: null,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            sizes: "xg;xl;sm",
            colors: "blue;brown;green;red",
          }),

          expect.objectContaining({
            id: expect.any(String),
            item_name: "Brown Shoe 22",
            value: 200,
            quantity: 1,
            item_image: null,
            description: "Fashion brown shoe 22",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: false,
            promotional_value: null,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            sizes: "xg;xl;sm",
            colors: "blue;brown;green;red",
          }),

          expect.objectContaining({
            id: expect.any(String),
            item_name: "Brown Shoe 23",
            value: 200,
            quantity: 1,
            item_image: null,
            description: "Fashion brown shoe 23",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            promotion: false,
            promotional_value: null,
            fkstore_id: storeCreated.id,
            fkstore_coin: "my coin",
            sizes: "xg;xl;sm",
            colors: "blue;brown;green;red",
          }),
        ]),
      })
    )
  })

  it("should not be possible to get an store item list without an store id.", async () => {
    await expect(() => {
      return sut.execute({
        storeId: null,
        page: 1,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid store id.",
      })
    )
  })

  it("should not be possible to get an store item list without if store id not exists.", async () => {
    await expect(() => {
      return sut.execute({
        storeId: "inexistent storeid",
        page: 1,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store id not found.",
      })
    )
  })
})
