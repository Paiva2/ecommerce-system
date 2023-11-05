import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import GetUserProfileService from "../../user/getUserProfileService"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import InMemoryUserItem from "../../../in-memory/InmemoryUserItem"
import { User } from "../../../@types/types"

let inMemoryUser: InMemoryUser
let inMemoryStore: InMemoryStore
let inMemoryWallet: InMemoryWallet
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryUserCoin: InMemoryUserCoin
let inMemoryUserItem: InMemoryUserItem

let registerNewUserService: RegisterNewUserServices
let userCreated: User
let sut: GetUserProfileService

describe.only("Get user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryWallet = new InMemoryWallet()
    inMemoryStoreCoin = new InMemoryStoreCoin()
    inMemoryUserCoin = new InMemoryUserCoin()
    inMemoryUserItem = new InMemoryUserItem()

    registerNewUserService = new RegisterNewUserServices(
      inMemoryUser,
      inMemoryWallet
    )
    sut = new GetUserProfileService(
      inMemoryUser,
      inMemoryStore,
      inMemoryStoreCoin,
      inMemoryWallet,
      inMemoryUserCoin,
      inMemoryUserItem
    )

    const { newUser } = await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    userCreated = newUser
  })

  it("should be possible to get an user profile without an store.", async () => {
    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        store: {},
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [],
        }),
        userItems: [],
      })
    )
  })

  it("should be possible to get an user profile with an store.", async () => {
    const { id: storeId } = await inMemoryStore.create(
      "test@email.com",
      "storeTest",
      "test description"
    )

    await inMemoryStoreCoin.insert("storecoin", storeId)

    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [],
        }),
        store: expect.objectContaining({
          id: expect.any(String),
          name: "storeTest",
          storeOwner: "test@email.com",
          description: "test description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "storecoin",
            fkstore_coin_owner: storeId,
          }),
        }),
        userItems: [],
      })
    )
  })

  it("should be possible to get an user profile with an store and coins.", async () => {
    const { id: storeId } = await inMemoryStore.create(
      "test@email.com",
      "storeTest",
      "test description"
    )

    const walletOwner = await inMemoryWallet.findUserWallet(userCreated.id)

    await inMemoryStoreCoin.insert("storecoin", storeId)

    await inMemoryUserCoin.insert(200, "any coin", walletOwner.id)

    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [
            expect.objectContaining({
              id: expect.any(String),
              coin_name: "any coin",
              updated_at: expect.any(String),
              fkcoin_owner: walletOwner.id,
              quantity: 200,
            }),
          ],
        }),
        store: expect.objectContaining({
          id: expect.any(String),
          name: "storeTest",
          storeOwner: "test@email.com",
          description: "test description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "storecoin",
            fkstore_coin_owner: storeId,
          }),
        }),
        userItems: [],
      })
    )
  })

  it("should be possible to get an user profile with an store, coins and user item.", async () => {
    const { id: storeId } = await inMemoryStore.create(
      "test@email.com",
      "storeTest",
      "test description"
    )

    const walletOwner = await inMemoryWallet.findUserWallet(userCreated.id)

    await inMemoryStoreCoin.insert("storecoin", storeId)

    await inMemoryUserCoin.insert(200, "any coin", walletOwner.id)

    await inMemoryUserItem.insertUserItemToUserPurchase(
      userCreated.id,
      "any coin",
      "random item",
      "random shop",
      1,
      200
    )

    const { user } = await sut.execute({
      userEmail: "test@email.com",
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test user",
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: [
            expect.objectContaining({
              id: expect.any(String),
              coin_name: "any coin",
              updated_at: expect.any(String),
              fkcoin_owner: walletOwner.id,
              quantity: 200,
            }),
          ],
        }),
        store: expect.objectContaining({
          id: expect.any(String),
          name: "storeTest",
          storeOwner: "test@email.com",
          description: "test description",
          store_coin: expect.objectContaining({
            id: expect.any(String),
            store_coin_name: "storecoin",
            fkstore_coin_owner: storeId,
          }),
        }),
        userItems: [
          expect.objectContaining({
            id: expect.any(String),
            item_name: "random item",
            purchase_date: expect.any(Date),
            purchased_at: "random shop",
            fkitem_owner: userCreated.id,
            purchased_with: "any coin",
            quantity: 1,
            item_value: 200,
          }),
        ],
      })
    )
  })

  it("should not be possible to get an user profile without an valid email.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide user an valid user email.",
      })
    )
  })

  it("should not be possible to get an user profile if user doesnt exists on database.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "inexistent@inexistent.com.br",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
