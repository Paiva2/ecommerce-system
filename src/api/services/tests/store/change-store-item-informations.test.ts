import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import InMemoryStoreCoin from "../../../in-memory/inMemoryStoreCoin"
import InMemoryStoreItem from "../../../in-memory/inMemoryStoreItem"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import { Store, StoreCoin, StoreItem, User } from "../../../@types/types"
import ChangeStoreItemInformationsService from "../../store/changeStoreItemInformationsService"

let inMemoryStore: InMemoryStore
let inMemoryStoreCoin: InMemoryStoreCoin
let inMemoryStoreItem: InMemoryStoreItem
let inMemoryUser: InMemoryUser

let storeCreation: Store
let storeCreationCoin: StoreCoin
let storeItemCreation: StoreItem[]
let userCreation: User

let sut: ChangeStoreItemInformationsService

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

const newUser = {
  email: "test@test.com",
  username: "test user",
  password: "1234567",
}

describe("Change Store Item Informations", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryStore = new InMemoryStore()
    inMemoryStoreItem = new InMemoryStoreItem()
    inMemoryStoreCoin = new InMemoryStoreCoin()

    sut = new ChangeStoreItemInformationsService(
      inMemoryUser,
      inMemoryStore,
      inMemoryStoreItem
    )

    userCreation = await inMemoryUser.insert(
      newUser.email,
      newUser.username,
      newUser.password
    )

    storeCreation = await inMemoryStore.create(
      newUser.email,
      "test store",
      "store description"
    )

    storeCreationCoin = await inMemoryStoreCoin.insert(
      "store coin",
      storeCreation.id
    )

    storeItemCreation = await inMemoryStoreItem.insert(
      Array({
        ...mockNewItem,
        storeId: storeCreation.id,
        storeCoin: storeCreationCoin.store_coin_name,
      })
    )
  })

  it("should be possible to edit store item informations.", async () => {
    const { updatedItem } = await sut.execute({
      itemId: storeItemCreation[0].id,
      userId: userCreation.id,
      informationsToUpdate: {
        description: "updating description",
        item_image: "updating image",
        colors: "updating colors",
        item_name: "updating item name",
        value: 1000,
        promotion: true,
        promotional_value: 1000,
        quantity: 10,
        sizes: "updating sizes",
      },
    })

    expect(updatedItem).toEqual(
      expect.objectContaining({
        id: storeItemCreation[0].id,
        item_name: "updating item name",
        value: 1000,
        quantity: 10,
        description: "updating description",
        fkstore_id: storeCreation.id,
        colors: "updating colors",
        sizes: "updating sizes",
        item_image: "updating image",
        updated_at: expect.any(Date),
        promotion: true,
        promotional_value: 1000,
      })
    )

    const { updatedItem: updateItemAgain } = await sut.execute({
      itemId: storeItemCreation[0].id,
      userId: userCreation.id,
      informationsToUpdate: {
        description: "updating description 2",
        item_image: "updating image 2",
        colors: "updating colors 2",
        item_name: "updating item name",
        promotion: false,
        promotional_value: 0,
      },
    })

    expect(updateItemAgain).toEqual(
      expect.objectContaining({
        id: storeItemCreation[0].id,
        item_name: "updating item name",
        value: 1000,
        quantity: 10,
        description: "updating description 2",
        fkstore_id: storeCreation.id,
        colors: "updating colors 2",
        sizes: "updating sizes",
        item_image: "updating image 2",
        updated_at: expect.any(Date),
        promotion: false,
        promotional_value: 0,
      })
    )
  })

  it("should return current item informations if none are provided to update.", async () => {
    const { checkIfItemExists } = await sut.execute({
      itemId: storeItemCreation[0].id,
      userId: userCreation.id,
      informationsToUpdate: {},
    })


    expect(checkIfItemExists).toEqual(
      expect.objectContaining({
        ...storeItemCreation[0],
      })
    )
  })

  it("should not  be possible to edit store item informations without user id.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: storeItemCreation[0].id,
        userId: null,
        informationsToUpdate: {},
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid userId.",
      })
    )
  })

  it("should not  be possible to edit store item informations without item id.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: null,
        userId: "any user id",
        informationsToUpdate: {},
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid itemId.",
      })
    )
  })

  it("should not be possible to edit store item informations if user doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: storeItemCreation[0].id,
        userId: "inexistent item id",
        informationsToUpdate: {},
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to edit store item informations if store doesnt exists.", async () => {
    const secondUserCreation = await inMemoryUser.insert(
      "seconduser@email.com",
      "second username",
      "1234567"
    )

    await expect(() => {
      return sut.execute({
        userId: secondUserCreation.id,
        itemId: "any item id",
        informationsToUpdate: {},
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store not found.",
      })
    )
  })

  it("should not  be possible to edit store item informations if item doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        itemId: "inexistent item id",
        userId: userCreation.id,
        informationsToUpdate: {},
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Item not found.",
      })
    )
  })
})
