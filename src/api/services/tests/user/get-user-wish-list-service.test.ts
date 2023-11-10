import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryUserWishList from "../../../in-memory/inMemoryUserWishList"
import InsertItemToWishListService from "../../user/insertItemToWishListService"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import InMemoryWishListItem from "../../../in-memory/inMemoryWishListItem"
import { Store, StoreItem } from "../../../@types/types"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"
import GetUserWishListService from "../../user/getUserWishListService"

let inMemoryUser: InMemoryUser
let inMemoryWallet: InMemoryWallet
let inMemoryUserWishList: InMemoryUserWishList
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryWishListItem: InMemoryWishListItem
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStore: InMemoryStore

let registerNewUserService: RegisterNewUserServices
let addNewItemToStoreListService: AddNewItemToStoreListService
let insertItemToWishListService: InsertItemToWishListService

let storeCreation: Store
let storeItemCreated: StoreItem

let sut: GetUserWishListService

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

describe("Get user wish list service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryWallet = new InMemoryWallet()
    inMemoryUserWishList = new InMemoryUserWishList()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryWishListItem = new InMemoryWishListItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStore = new InMemoryStore()

    sut = new GetUserWishListService(
      inMemoryUser,
      inMemoryUserWishList,
      inMemoryWishListItem
    )

    addNewItemToStoreListService = new AddNewItemToStoreListService(
      inMemoryStore,
      inMemoryStoreItem,
      inMemoryStoreCoin
    )

    insertItemToWishListService = new InsertItemToWishListService(
      inMemoryUser,
      inMemoryUserWishList,
      inMemoryStoreItem,
      inMemoryWishListItem
    )

    registerNewUserService = new RegisterNewUserServices(
      inMemoryUser,
      inMemoryWallet,
      inMemoryUserWishList
    )

    const { newUser } = await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    storeCreation = await inMemoryStore.create(
      newUser.email,
      "test store",
      "store description"
    )

    await inMemoryStoreCoin.insert("store coin", storeCreation.id)

    const { newItemListCreation } = await addNewItemToStoreListService.handle({
      itemList: Array(mockNewItem),
      userEmail: newUser.email,
    })

    storeItemCreated = newItemListCreation[0]
  })

  it("should be possible to get all items from user wish list.", async () => {
    const { newUser: userForWishList } = await registerNewUserService.execute({
      email: "test2@email.com",
      username: "test user 2",
      password: "123456",
    })

    await insertItemToWishListService.execute({
      itemId: storeItemCreated.id,
      userId: userForWishList.id,
    })

    const getUserWishList = await inMemoryUserWishList.getUserWishList(
      userForWishList.id
    )

    const { getWishListItems } = await sut.execute({
      userId: userForWishList.id,
    })

    expect(getWishListItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          fk_wishlist_item_owner: getUserWishList.id,
          name: mockNewItem.itemName,
          item_value: mockNewItem.value,
          item_image: mockNewItem.itemImage,
          item_id: storeItemCreated.id,
        }),
      ])
    )
  })

  it("should return an empty list if none item are added to wish list.", async () => {
    const { newUser: userForWishList } = await registerNewUserService.execute({
      email: "test2@email.com",
      username: "test user 2",
      password: "123456",
    })

    await inMemoryUserWishList.getUserWishList(userForWishList.id)

    const { getWishListItems } = await sut.execute({
      userId: userForWishList.id,
    })

    expect(getWishListItems).toEqual([])
  })

  it("should not be possible to get all items from user wish list without an user id.", async () => {
    await expect(() => {
      return sut.execute({
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })
})
