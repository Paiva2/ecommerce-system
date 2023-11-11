import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import CreateNewStoreService from "../../store/createNewStoreService"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import { Store, User } from "../../../@types/types"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"
import RemoveStoreItemFromListService from "../../user/removeStoreItemFromListService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let createNewStoreService: CreateNewStoreService
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem

let addNewItemToStoreListService: AddNewItemToStoreListService

let storeCreated: Store
let userCreated: User

let sut: RemoveStoreItemFromListService

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

describe("Remove store item from list service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStoreItem = new InMemoryStoreItem()

    sut = new RemoveStoreItemFromListService(
      inMemoryUser,
      inMemoryStore,
      inMemoryStoreItem
    )

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

    userCreated = await inMemoryUser.insert(
      userTest.email,
      userTest.username,
      userTest.password
    )

    const { store } = await createNewStoreService.execute({
      storeCoin: "my coin",
      storeName: "store 1",
      storeOwner: userTest.email,
      storeDescription: "store desc",
    })

    storeCreated = store
  })

  it("should be possible to remove an item from my store item list.", async () => {
    const { newItemListCreation: itemToRemove } =
      await addNewItemToStoreListService.handle({
        itemList: Array(mockNewItem),
        userEmail: userTest.email,
      })

    await addNewItemToStoreListService.handle({
      itemList: Array({
        ...mockNewItem,
        itemName: "Red Shoe",
        value: 300,
        promotion: true,
        description: "Fashion red shoe",
      }),
      userEmail: userTest.email,
    })

    const { updatedStoreItems } = await sut.execute({
      itemId: itemToRemove[0].id,
      userId: userCreated.id,
    })

    expect(updatedStoreItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          item_name: "Red Shoe",
          value: 300,
          quantity: 1,
          item_image: null,
          description: "Fashion red shoe",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          promotion: true,
          promotional_value: null,
          fkstore_id: storeCreated.id,
          fkstore_coin: "my coin",
          sizes: "xg;xl;sm",
          colors: "blue;brown;green;red",
        }),
      ])
    )
  })

  it("should not be possible to remove an item from my store item list without an user id.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to remove an item from my store item list without an store created.", async () => {
    const userWithoutStore = await inMemoryUser.insert(
      "user@email.com",
      "user test",
      "123456"
    )

    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        userId: userWithoutStore.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
