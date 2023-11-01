import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import { Store, StoreCoin } from "../../../@types/types"

let inMemoryStore: InMemoryStore
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryUser: InMemoryUser
let sut: AddNewItemToStoreListService

let storeCreation = {} as Store
let storeCreationCoin = {} as StoreCoin

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

describe("Add new item to store list service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryUser = new InMemoryUser()

    sut = new AddNewItemToStoreListService(
      inMemoryStore,
      inMemoryStoreItem,
      inMemoryStoreCoin
    )

    const newUser = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    await inMemoryUser.insert(
      newUser.email,
      newUser.username,
      newUser.password
    )

    storeCreation = await inMemoryStore.create(
      newUser.email,
      "test store",
      "store description"
    )

    storeCreationCoin = await inMemoryStoreCoin.insert(
      "store coin",
      storeCreation.id
    )
  })

  it("should be possible to create a new store item.", async () => {
    const { newItemListCreation } = await sut.handle({
      itemList: Array(mockNewItem),
      userEmail: "test@test.com",
    })

    expect(newItemListCreation).toEqual(
      expect.arrayContaining([
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
          fkstore_id: storeCreation.id,
          fkstore_coin: storeCreationCoin.store_coin_name,
        }),
      ])
    )
  })

  it("should be possible to create a list of store items.", async () => {
    const itemList = []

    for (let i = 1; i <= 20; i++) {
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

    const { newItemListCreation } = await sut.handle({
      itemList: itemList,
      userEmail: "test@test.com",
    })

    expect(newItemListCreation.length).toEqual(20)

    expect(newItemListCreation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          item_name: "Brown Shoe 1",
          value: 200,
          quantity: 1,
          item_image: null,
          description: "Fashion brown shoe 1",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          promotion: false,
          promotional_value: null,
          fkstore_id: storeCreation.id,
          fkstore_coin: storeCreationCoin.store_coin_name,
          sizes: "xg;xl;sm",
          colors: "blue;brown;green;red",
        }),

        expect.objectContaining({
          id: expect.any(String),
          item_name: "Brown Shoe 20",
          value: 200,
          quantity: 1,
          item_image: null,
          description: "Fashion brown shoe 20",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          promotion: false,
          promotional_value: null,
          fkstore_id: storeCreation.id,
          fkstore_coin: storeCreationCoin.store_coin_name,
          sizes: "xg;xl;sm",
          colors: "blue;brown;green;red",
        }),
      ])
    )
  })

  it("should not be possible to create a new store item if user email are not provided.", async () => {
    await expect(() => {
      return sut.handle({
        itemList: Array(mockNewItem),
        userEmail: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user e-mail.",
      })
    )
  })

  it("should not be possible to create a new store item if store id are not registered.", async () => {
    await inMemoryUser.insert(
      "userwithnostore@email.com",
      "test user",
      "123456"
    )

    await expect(() => {
      return sut.handle({
        itemList: Array(mockNewItem),
        userEmail: "userwithnostore@email.com",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
