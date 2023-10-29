import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import { Store, User } from "../../../@types/types"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import RegisterNewUserServices from "../../user/registerNewUserService"
import UpdateUserStoreCoinService from "../../store/updateUserStoreCoinService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryUserCoin: InMemoryUserCoin
let inMemoryWallet: InMemoryWallet
let inMemoryStoreCoin: InMemoryStoreCoin

let registerNewUserService: RegisterNewUserServices
let sut: UpdateUserStoreCoinService

let newUser: User
let userToReceive: User
let store: Store

describe("Update user store coin service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    inMemoryUserCoin = new InMemoryUserCoin()
    inMemoryWallet = new InMemoryWallet()
    inMemoryStoreCoin = new InMemoryStoreCoin()

    registerNewUserService = new RegisterNewUserServices(
      inMemoryUser,
      inMemoryWallet
    )

    sut = new UpdateUserStoreCoinService(
      inMemoryStore,
      inMemoryUser,
      inMemoryStoreCoin,
      inMemoryUserCoin,
      inMemoryWallet
    )

    const storeOwner = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    const userThatWillReceive = {
      email: "test2@test2.com",
      username: "test user to receive",
      password: "1234567",
    }

    const { newUser: createdUserToGiveStoreCoin } =
      await registerNewUserService.execute(storeOwner)

    const { newUser: createdUserToReceiveCoin } =
      await registerNewUserService.execute(userThatWillReceive)

    const storeCreated = await inMemoryStore.create(
      "test@test.com",
      "test user",
      "store desc"
    )

    store = storeCreated
    newUser = createdUserToGiveStoreCoin
    userToReceive = createdUserToReceiveCoin
  })

  it("should be possible to update all user coin value.", async () => {
    await inMemoryStoreCoin.insert("mycointest", store.id)

    await inMemoryUserCoin.insert(100, "mycointest", userToReceive.wallet.id)

    const { userCoinUpdated } = await sut.execute({
      newValue: 0,
      storeId: store.id,
      userToUpdate: userToReceive.email,
    })

    expect(userCoinUpdated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        quantity: 0,
        fkcoin_owner: userToReceive.wallet.id,
        updated_at: expect.any(String),
      })
    )
  })

  it("should not be possible to update an user store coins without an store id.", async () => {
    await expect(() => {
      return sut.execute({
        newValue: 0,
        storeId: null,
        userToUpdate: userToReceive.email,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide an valid store id.",
      })
    )
  })

  it("should not be possible to update an user store coins if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        newValue: 100,
        storeId: store.id,
        userToUpdate: "inexistent@email.com",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to update an user store coins if store doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        newValue: 200,
        storeId: "inexistent",
        userToUpdate: userToReceive.email,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
