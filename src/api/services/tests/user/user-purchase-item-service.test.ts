import { describe, it, expect, beforeEach, vi } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryUserItem from "../../../in-memory/InmemoryUserItem"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import UserPurchaseItemService from "../../user/userPurchaseItemService"
import { Store, StoreItem } from "../../../@types/types"
import InMemoryStoreCoupon from "../../../in-memory/inMemoryStoreCoupon"

let inMemoryUser: InMemoryUser
let inMemoryWallet: InMemoryWallet
let inMemoryUserItem: InMemoryUserItem
let inMemoryUserCoin: InMemoryUserCoin
let inMemoryStore: InMemoryStore
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreCoupon: InMemoryStoreCoupon

let sut: UserPurchaseItemService

const mockNewItem = {
  itemName: "Brown Shoe",
  value: 200,
  quantity: 2,
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
    inMemoryStoreCoupon = new InMemoryStoreCoupon()

    sut = new UserPurchaseItemService(
      inMemoryUser,
      inMemoryWallet,
      inMemoryUserItem,
      inMemoryUserCoin,
      inMemoryStore,
      inMemoryStoreItem,
      inMemoryStoreCoin,
      inMemoryStoreCoupon
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
      items: [
        {
          itemId: storeItemCreated[0].id,
          itemQuantity: 1,
        },
      ],
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
    expect(desiredStoreItem.quantity).toBe(1)

    expect(userItem).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Brown Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 1,
        item_value: 200,
        total_value: 200,
      }),
    ])
  })

  it("should be possible to an user buy an store item with an valid coupon code.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(200, "test coin", userCreatedWallet.id)

    const fakeCouponDate = new Date(2050, 1, 1, 13)

    await inMemoryStoreCoupon.insert({
      active: true,
      coupon_code: "TEST",
      discount: "20", // 20%
      storeId: storeCreated.id,
      validation_date: fakeCouponDate,
    })

    const { userItem } = await sut.execute({
      items: [
        {
          itemId: storeItemCreated[0].id,
          itemQuantity: 1,
        },
      ],
      storeId: storeCreated.id,
      userId: userCreated.id,
      coupon: "TEST",
    })

    const desiredStoreItem = await inMemoryStoreItem.findStoreItem(
      storeCreated.id,
      storeItemCreated[0].id
    )

    const coinBalance = await inMemoryUserCoin.findUserCoinByCoinName(
      userCreatedWallet.id,
      "test coin"
    )

    expect(coinBalance.quantity).toBe(40)
    expect(desiredStoreItem.quantity).toBe(1)

    expect(userItem).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Brown Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 1,
        item_value: 200,
        total_value: 200,
      }),
    ])
  })

  it("should not be possible to an user buy an store item with an valid coupon code if coupon code doenst exists.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(200, "test coin", userCreatedWallet.id)

    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 1,
          },
        ],
        storeId: storeCreated.id,
        userId: userCreated.id,
        coupon: "INEXISTENT",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid coupon code.",
      })
    )
  })

  it("should not be possible to an user buy an store item with an coupon code if coupon isnt active.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(200, "test coin", userCreatedWallet.id)

    await inMemoryStoreCoupon.insert({
      active: false,
      coupon_code: "TEST",
      discount: "20",
      storeId: storeCreated.id,
      validation_date: new Date(),
    })

    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 1,
          },
        ],
        storeId: storeCreated.id,
        userId: userCreated.id,
        coupon: "TEST",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "This coupon is not active.",
      })
    )
  })

  it("should not be possible to an user buy an store item with an coupon code if coupon has expired.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(200, "test coin", userCreatedWallet.id)
    vi.useFakeTimers()

    const fakeCouponDate = new Date(2030, 1, 1, 0) // 01/01/2030

    vi.setSystemTime(fakeCouponDate)

    await inMemoryStoreCoupon.insert({
      active: true,
      coupon_code: "TEST",
      discount: "20",
      storeId: storeCreated.id,
      validation_date: fakeCouponDate,
    })

    const fakeBuyDate = new Date(2030, 1, 2, 0) // 02/01/2030

    vi.setSystemTime(fakeBuyDate)

    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 1,
          },
        ],
        storeId: storeCreated.id,
        userId: userCreated.id,
        coupon: "TEST",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "This coupon has expired.",
      })
    )

    vi.useRealTimers()
  })

  it("should be possible to an user buy an store item ON PROMOTION if user has that store balance available on wallet.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(400, "test coin", userCreatedWallet.id)

    const { userItem } = await sut.execute({
      items: [
        {
          itemId: promotionalStoreItemCreated[0].id,
          itemQuantity: 1,
        },
      ],
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

    expect(userItem).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Red Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 1,
        item_value: 200,
        total_value: 200,
      }),
    ])
  })

  it("should be possible to an user buy an quantity of store item if user has that store balance available on wallet.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    const userCreatedWallet = await inMemoryWallet.create(userCreated.id)

    await inMemoryUserCoin.insert(400, "test coin", userCreatedWallet.id)

    const { userItem } = await sut.execute({
      items: [
        {
          itemId: storeItemCreated[0].id,
          itemQuantity: 2,
        },
      ],
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

    // checking if item quantity changed on store
    expect(desiredStoreItem.quantity).toBe(0)

    // checking if user balance changed
    expect(coinBalance.quantity).toBe(0)

    expect(userItem).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        item_name: "Brown Shoe",
        purchase_date: expect.any(Date),
        purchased_at: storeCreated.name,
        fkitem_owner: userCreated.id,
        purchased_with: "test coin",
        quantity: 2,
        item_value: 200,
        total_value: 400,
      }),
    ])
  })

  it("should not be possible to an user buy an store item if store id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: null,
            itemQuantity: 1,
          },
        ],
        storeId: null,
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid storeId.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 1,
          },
        ],
        storeId: "any store id",
        userId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid userId.",
      })
    )
  })

  it("should not be possible to an user buy an store item if item id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: null,
            itemQuantity: 1,
          },
        ],
        storeId: "any store id",
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Item id can't be empty.",
      })
    )
  })

  it("should not be possible to an user buy an store item if desired quantity are less than 1.", async () => {
    await expect(() => {
      return sut.execute({
        items: [
          {
            itemId: "any item id",
            itemQuantity: 0,
          },
        ],
        storeId: "any store id",
        userId: "any user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Quantity can't be less than 1.",
      })
    )
  })

  it("should not be possible to an user buy an store item if user id doesnt exists on database.", async () => {
    await expect(() => {
      return sut.execute({
        userId: "inexistent user id",
        items: [
          {
            itemId: "any item id",
            itemQuantity: 1,
          },
        ],
        storeId: "any store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to an user buy an store item if store id doesnt exists on database.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        items: [
          {
            itemId: "any item id",
            itemQuantity: 1,
          },
        ],
        storeId: "inexistent store id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })

  it("should not be possible to an user buy an store item if store item id doesnt exists on database.", async () => {
    const userCreated = await inMemoryUser.insert("user@email.com", "user", "123456")

    await expect(() => {
      return sut.execute({
        userId: userCreated.id,
        items: [
          {
            itemId: "inexistent item id",
            itemQuantity: 1,
          },
        ],
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store item not found.",
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
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 3,
          },
        ],
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: expect.stringContaining("quantity unavailable."),
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
        items: [
          {
            itemId: promotionalStoreItemCreated[0].id,
            itemQuantity: 1,
          },
        ],
        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user balance.",
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
        items: [
          {
            itemId: storeItemCreated[0].id,
            itemQuantity: 1,
          },
        ],

        storeId: storeCreated.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user balance.",
      })
    )
  })
})
