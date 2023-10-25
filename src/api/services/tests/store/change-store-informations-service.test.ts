import { describe, it, beforeEach, expect } from "vitest"
import InMemoryStore from "../../../in-memory/inMemoryStore"
import ChangeStoreInformationsService from "../../store/changeStoreInformationsService"

let inMemoryStore: InMemoryStore
let sut: ChangeStoreInformationsService

describe("Change store informations service", () => {
  beforeEach(async () => {
    inMemoryStore = new InMemoryStore()
    sut = new ChangeStoreInformationsService(inMemoryStore)
  })

  it("should be possible to update an store informations.", async () => {
    const { id } = await inMemoryStore.create(
      "test@test.com",
      "test store name",
      "mycoinname",
      "test description"
    )

    const storeUpdate = await sut.execute({
      storeOwner: "test@test.com",
      storeUpdate: {
        storeId: id,
        description: "changing description",
        name: "changing name",
      },
    })

    expect(storeUpdate).toEqual(
      expect.objectContaining({
        description: "changing description",
        name: "changing name",
      })
    )
  })

  it("should return current store informations if none information are provided to update.", async () => {
    const { id } = await inMemoryStore.create(
      "test@test.com",
      "test store name",
      "mycoinname",
      "test description"
    )

    const updatedStore = await sut.execute({
      storeOwner: "test@test.com",
      storeUpdate: {
        storeId: id,
      },
    })

    expect(updatedStore).toEqual(
      expect.objectContaining({
        name: "test store name",
        description: "test description",
        store_coin: "mycoinname",
      })
    )
  })

  it("should not be possible to update store informations without email.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwner: "",
        storeUpdate: {
          storeId: "",
          description: "changing description",
          name: "changing name",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user e-mail.",
      })
    )
  })

  it("should not be possible to update store informations without store id.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwner: "test@test.com",
        storeUpdate: {
          storeId: "",
          description: "changing description",
          name: "changing name",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid store id.",
      })
    )
  })

  it("should not be possible to update store informations if store id doesnt exists.", async () => {
    await expect(() => {
      return sut.execute({
        storeOwner: "test@test.com",
        storeUpdate: {
          storeId: "inexistent id",
          description: "changing description",
          name: "changing name",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Store id not found.",
      })
    )
  })

  it("should not be possible to update store informations if store owner is different from store owner email provided.", async () => {
    const { id } = await inMemoryStore.create(
      "test@test.com",
      "test store name",
      "test description"
    )

    await expect(() => {
      return sut.execute({
        storeOwner: "different@different.com",
        storeUpdate: {
          storeId: id,
          description: "changing description",
          name: "changing name",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid store owner.",
      })
    )
  })
})
