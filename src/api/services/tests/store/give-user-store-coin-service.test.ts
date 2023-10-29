import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import GiveUserStoreCoinService from "../../store/giveUserStoreCoinService"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import { User } from "../../../@types/types"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import RegisterNewUserServices from "../../user/registerNewUserService"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryUserCoin: InMemoryUserCoin
let inMemoryWallet: InMemoryWallet
let inMemoryStoreCoin: InMemoryStoreCoin

let registerNewUserService: RegisterNewUserServices
let sut: GiveUserStoreCoinService

let newUser: User
let userToReceive: User

describe("Give user store coin service", () => {
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

    sut = new GiveUserStoreCoinService(
      inMemoryStore,
      inMemoryUser,
      inMemoryUserCoin,
      inMemoryWallet,
      inMemoryStoreCoin
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

    newUser = createdUserToGiveStoreCoin
    userToReceive = createdUserToReceiveCoin
  })

  it("should be possible to give an user store coins.", async () => {
    const store = await inMemoryStore.create(
      "test@test.com",
      "test user",
      "store desc"
    )

    await inMemoryStoreCoin.insert("mycointest", store.id)

    const userCoinCreated = await sut.execute({
      storeOwnerEmail: "test@test.com", // store giving
      userToReceive: "test2@test2.com",
      valueToGive: 2000,
    })

    expect(userCoinCreated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        quantity: 2000,
        fkcoin_owner: userToReceive.wallet.id,
        updated_at: expect.any(String),
      })
    )
  })

  it("should add the value to user if user already has that coin on wallet.", async () => {
    const store = await inMemoryStore.create(
      "test@test.com",
      "test user",
      "store desc"
    )

    await inMemoryStoreCoin.insert("mycointest", store.id)

    await sut.execute({
      storeOwnerEmail: "test@test.com", // store giving
      userToReceive: "test2@test2.com",
      valueToGive: 2000,
    })

    const userCoinUpdated = await sut.execute({
      storeOwnerEmail: "test@test.com",
      userToReceive: "test2@test2.com",
      valueToGive: 2000,
    })

    expect(userCoinUpdated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        quantity: 4000,
        fkcoin_owner: userToReceive.wallet.id,
        updated_at: expect.any(String),
      })
    )
  })

  it("should not be possible to give an user store coins without an store id.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwnerEmail: null,
        userToReceive: "test2@test2.com",
        valueToGive: 2000,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide an valid store id.",
      })
    )
  })

  it("should not be possible to give an user store coins without an valid value.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwnerEmail: "valid store id test",
        userToReceive: "test2@test2.com",
        valueToGive: 0,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide an valid value.",
      })
    )
  })

  it("should not be possible to give an user store coins if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwnerEmail: "valid store id test",
        userToReceive: "inexistent@inexist.com",
        valueToGive: 1000,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to give an user store coins if store doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwnerEmail: "invalid store id test",
        userToReceive: newUser.email,
        valueToGive: 1000,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })
})
