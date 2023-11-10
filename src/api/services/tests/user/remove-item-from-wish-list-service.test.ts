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
import RemoveItemFromWishListService from "../../user/removeItemFromWishListService"

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
let secondStoreItemCreated: StoreItem

let sut: RemoveItemFromWishListService

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

describe("Remove item from wish list service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryWallet = new InMemoryWallet()
    inMemoryUserWishList = new InMemoryUserWishList()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryWishListItem = new InMemoryWishListItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryStore = new InMemoryStore()

    sut = new RemoveItemFromWishListService(
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

    const { newItemListCreation: secondNewItem } =
      await addNewItemToStoreListService.handle({
        itemList: Array({
          ...mockNewItem,
          itemName: "red shoe",
          value: 500,
          promotion: true,
        }),
        userEmail: newUser.email,
      })

    storeItemCreated = newItemListCreation[0]
    secondStoreItemCreated = secondNewItem[0]
  })

  it("should be possible to remove an item from user wish list.", async () => {
    const { newUser: userForWishList } = await registerNewUserService.execute({
      email: "test2@email.com",
      username: "test user 2",
      password: "123456",
    })

    const { newWishListItem } = await insertItemToWishListService.execute({
      itemId: storeItemCreated.id,
      userId: userForWishList.id,
    })

    // adding other item to wish list
    const secondNewWishListItem = await insertItemToWishListService.execute({
      itemId: secondStoreItemCreated.id,
      userId: userForWishList.id,
    })

    const { updatedWishList } = await sut.execute({
      itemId: newWishListItem.id,
      userId: userForWishList.id,
    })

    expect(updatedWishList).toEqual([
      expect.objectContaining({
        fk_wishlist_item_owner: expect.any(String),
        id: secondNewWishListItem.newWishListItem.id,
        item_id: secondStoreItemCreated.id,
        item_image: secondStoreItemCreated.item_image,
        item_value: secondStoreItemCreated.value,
        name: secondStoreItemCreated.item_name,
      }),
    ])
  })

  it("should not be possible to remove an item from user wish list without an user id.", async () => {
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

  it("should not be possible to remove an item from user wish list without an item id.", async () => {
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

  it("should not be possible to remove an item from user wish list if user doesnt exists.", async () => {
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
})
