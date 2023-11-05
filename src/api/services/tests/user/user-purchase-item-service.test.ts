import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryUserItem from "../../../in-memory/InmemoryUserItem"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import { Store, StoreItem } from "../../../@types/types"
import UserPurchaseItemService from "../../user/userPurchaseItemService"

let inMemoryUser: InMemoryUser
let inMemoryWallet: InMemoryWallet
let inMemoryUserItem: InMemoryUserItem
let inMemoryUserCoin: InMemoryUserCoin
let inMemoryStore: InMemoryStore
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryStoreCoin: InMemoryStoreCoin

let sut: UserPurchaseItemService

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

const mockNewPromotionalItem = {
  itemName: "Red Shoe",
  value: 300,
  quantity: 2,
  description: "Fashion red shoe",
  promotion: true,
  promotionalValue: 200,
  itemImage: null,
  colors: "red",
  sizes: "x",
}

let storeCreated: Store
let storeItemCreated: StoreItem[]
let promotionalStoreItemCreated: StoreItem[]

describe("User purchase item service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryWallet = new InMemoryWallet()
    inMemoryUserItem = new InMemoryUserItem()
    inMemoryUserCoin = new InMemoryUserCoin()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()

    sut = new UserPurchaseItemService(
      inMemoryUser,
      inMemoryWallet,
      inMemoryUserItem,
      inMemoryUserCoin,
      inMemoryStore,
      inMemoryStoreItem
    )

    // Store that will sell

    await inMemoryUser.insert("test@email.com", "test user", "123456")

    storeCreated = await inMemoryStore.create("test@email.com", "test store")

    await inMemoryStoreCoin.insert("test coin", storeCreated.id)

    storeItemCreated = await inMemoryStoreItem.insert(
      Array({
        ...mockNewItem,
        storeId: storeCreated.id,
        storeCoin: "test coin",
      })
    )

    promotionalStoreItemCreated = await inMemoryStoreItem.insert(
      Array({
        ...mockNewPromotionalItem,
        storeId: storeCreated.id,
        storeCoin: "test coin",
      })
    )
  })

  it("should be possible to an user buy an store item if user has that store balance available on wallet.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(250, "test coin", userCreatedWallet.id)

    const { userItem } = await sut.execute({
      itemId: storeItemCreated[0].id,
      quantity: 1,
      storeId: storeCreated.id,
      userId: userCreated.id,
    })

    const desiredStoreItem = await inMemoryStoreItem.findStoreItem(
      storeCreated.id,
      storeItemCreated[0].id
    )

    const coinBalance = await inMemoryUserCoin.findUserCoinByCoinName(
      userCreatedWallet.id,
      "test coin"
    )

    expect(coinBalance.quantity).toBe(50)
    expect(desiredStoreItem.quantity).toBe(0)

    expect(userItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Brown Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 1,
        item_value: 200,
      })
    )
  })

  it("should be possible to an user buy an store item ON PROMOTION if user has that store balance available on wallet.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(400, "test coin", userCreatedWallet.id)

    const { userItem } = await sut.execute({
      itemId: promotionalStoreItemCreated[0].id,
      quantity: 1,
      storeId: storeCreated.id,
      userId: userCreated.id,
    })

    const desiredStoreItem = await inMemoryStoreItem.findStoreItem(
      storeCreated.id,
      promotionalStoreItemCreated[0].id
    )

    const coinBalance = await inMemoryUserCoin.findUserCoinByCoinName(
      userCreatedWallet.id,
      "test coin"
    )

    expect(coinBalance.quantity).toBe(200)

    expect(desiredStoreItem.quantity).toBe(1)

    expect(userItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Red Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 1,
        item_value: 200,
      })
    )
  })

  it("should not be possible to an user buy an store item if store id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: storeItemCreated[0].id,
        quantity: 1,
        storeId: null,
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Invalid storeId.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: storeItemCreated[0].id,
        quantity: 1,
        storeId: "any store id",
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Invalid userId.",
      })
    )
  })

  it("should not be possible to an user buy an store item if item id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: null,
        quantity: 1,
        storeId: "any store id",
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Invalid itemId.",
      })
    )
  })

  it("should not be possible to an user buy an store item if desired quantity are less than 1.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "any item id",
        quantity: 0,
        storeId: "any store id",
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        status: 409,
        message: "Invalid quantity.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user id doesnt exists on database.", async () => {
    await expect(() => {
      return sut.execute({
        userId: "inexistent user id",
        itemId: "any item id",
        quantity: 1,
        storeId: "any store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "User not found.",
      })
    )
  })

  it("should not be possible to an user buy an store item if store id doesnt exists on database.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        itemId: "any item id",
        quantity: 1,
        storeId: "inexistent store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Store not found.",
      })
    )
  })

  it("should not be possible to an user buy an store item if store item id doesnt exists on database.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        itemId: "inexistent item id",
        quantity: 1,
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Store item not found.",
      })
    )
  })

  it("should not be possible to an user buy an store item if desired quantity doesnt match with available quantity on store.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(199, "test coin", userCreatedWallet.id)

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        itemId: storeItemCreated[0].id,
        quantity: 2,
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Item quantity unavailable.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user has no total balance to buy that item ON PROMO.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(199, "test coin", userCreatedWallet.id)

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        itemId: promotionalStoreItemCreated[0].id,
        quantity: 1,
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Invalid user balance.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user has no total balance to buy that item OUT PROMO", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(199, "test coin", userCreatedWallet.id)

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        itemId: storeItemCreated[0].id,
        quantity: 1,
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Invalid user balance.",
      })
    )
  })
})
