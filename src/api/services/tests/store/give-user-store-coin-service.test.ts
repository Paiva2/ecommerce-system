import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import GiveUserStoreCoinService from "../../store/giveUserStoreCoinService"
import InMemoryUserCoin from "../../../in-memory/inMemoryUserCoin"
import { User } from "../../../@types/types"

let inMemoryStore: InMemoryStore
let inMemoryUser: InMemoryUser
let inMemoryUserCoin: InMemoryUserCoin
let sut: GiveUserStoreCoinService

let newUser: User

describe.only("Give user store coin service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    inMemoryUser = new InMemoryUser()
    inMemoryUserCoin = new InMemoryUserCoin()

    sut = new GiveUserStoreCoinService(inMemoryStore, inMemoryUser, inMemoryUserCoin)

    const storeOwner = {
      email: "test@test.com",
      username: "test user",
      password: "1234567",
    }

    newUser = await inMemoryUser.insert(
      storeOwner.email,
      storeOwner.username,
      storeOwner.password
    )
  })

  /* it("should be possible to give an user store coins.", async () => {
    const userToReceive = await inMemoryUser.insert(
      "test2@test2.com",
      "test user to receive",
      "1234567"
    )

    const store = await inMemoryStore.create(
      "test@test.com",
      "test user",
      "mycointest"
    )

    const userCoinCreated = await sut.execute({
      storeId: store.id,
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
  }) */

  it.only("should add the value to user if user already has that coin on wallet.", async () => {
    const userToReceive = await inMemoryUser.insert(
      "test2@test2.com",
      "test user to receive",
      "1234567"
    )

    const store = await inMemoryStore.create(
      "test@test.com",
      "test user",
      "mycointest"
    )

    await sut.execute({
      storeId: store.id,
      userToReceive: "test2@test2.com",
      valueToGive: 2000,
    })

    const userCoinUpdated = await sut.execute({
      storeId: store.id,
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
  /* 
  it("should not be possible to give an user store coins without an store id.", async () => {
    await expect(() => {
      return sut.execute({
        storeId: null,
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
        storeId: "valid store id test",
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
        storeId: "valid store id test",
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
        storeId: "invalid store id test",
        userToReceive: newUser.email,
        valueToGive: 1000,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  }) */
})
