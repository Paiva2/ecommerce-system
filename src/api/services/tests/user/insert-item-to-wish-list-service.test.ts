import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryUserWishList from "../../../in-memory/inMemoryUserWishList"
import InsertItemToWishListService from "../../user/insertItemToWishListService"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import InMemoryWishListItem from "../../../in-memory/inMemoryWishListItem"
import { Store, StoreCoin, StoreItem } from "../../../@types/types"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import AddNewItemToStoreListService from "../../store/addNewItemToStoreListService"

let inMemoryUser: InMemoryUser
let inMemoryWallet: InMemoryWallet
let inMemoryUserWishList: InMemoryUserWishList
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryWishListItem: InMemoryWishListItem
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStore: InMemoryStore

let registerNewUserService: RegisterNewUserServices
let addNewItemToStoreListService: AddNewItemToStoreListService

let sut: InsertItemToWishListService

let storeCreation: Store
let storeCreationCoin: StoreCoin
let storeItemCreated: StoreItem

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

describe("Inser Item To Wish List Service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryWallet = new InMemoryWallet()
    inMemoryUserWishList = new InMemoryUserWishList()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryWishListItem = new InMemoryWishListItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStore = new InMemoryStore()

    addNewItemToStoreListService = new AddNewItemToStoreListService(
      inMemoryStore,
      inMemoryStoreItem,
      inMemoryStoreCoin
    )

    sut = new InsertItemToWishListService(
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

    storeCreationCoin = await inMemoryStoreCoin.insert(
      "store coin",
      storeCreation.id
    )

    const { newItemListCreation } = await addNewItemToStoreListService.handle({
      itemList: Array(mockNewItem),
      userEmail: newUser.email,
    })

    storeItemCreated = newItemListCreation[0]
  })

  it("should be possible to insert a new store item to user wish list.", async () => {
    const { newUser: userForWishList } = await registerNewUserService.execute({
      email: "test2@email.com",
      username: "test user 2",
      password: "123456",
    })

    const { newWishListItem } = await sut.execute({
      itemId: storeItemCreated.id,
      userId: userForWishList.id,
    })

    const getUserWishList = await inMemoryUserWishList.getUserWishList(
      userForWishList.id
    )

    expect(newWishListItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        fk_wishlist_item_owner: getUserWishList.id,
        name: mockNewItem.itemName,
        item_value: mockNewItem.value,
        item_image: mockNewItem.itemImage,
        item_id: storeItemCreated.id,
      })
    )
  })

  it("should not be possible to insert a new store item to user wish list without an user id.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: storeItemCreated.id,
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to insert a new store item to user wish list without an item id.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: null,
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid item id.",
      })
    )
  })

  it("should not be possible to insert a new store item to user wish list if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        userId: "inexistent user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to insert a new store item to user wish list if store item doesnt exists.", async () => {
    const { newUser: userForWishList } = await registerNewUserService.execute({
      email: "test2@email.com",
      username: "test user 2",
      password: "123456",
    })

    await expect(() => {
      return sut.execute({
        itemId: "inexistent store item",
        userId: userForWishList.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store item not found.",
      })
    )
  })
})
