import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Get store item controller", () => {
  beforeAll(async () => {
    await request(app).post("/register").send({
      email: "admin@admin.com.br",
      password: "123456",
      username: "admin",
    })
  })

  afterAll(() => {
    server.close()
  })

  it("should be possible to get an store item by store and item id.", async () => {
    const login = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    const getStore = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const storeId = getStore.body.data.store.id

    let itemList = [
      {
        itemName: `item 1`,
        value: 200,
        quantity: 5,
        description: `My item 1`,
        promotion: true,
        promotionalValue: 140,
        itemImage: null,
        colors: "red;green",
        sizes: "l",
      },
    ]

    await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList,
      })

    const getStoreItemList = await request(app).get(`/list/${storeId}?page=1`).send()

    const preCreatedItemId = getStoreItemList.body.items[0].id

    const getItem = await request(app)
      .get(`/item?storeId=${storeId}&itemId=${preCreatedItemId}`)
      .send()

    expect(getItem.statusCode).toBe(200)

    expect(getItem.body).toEqual(
      expect.objectContaining({
        storeName: "test store",
        storeOwner: "admin@admin.com.br",
        storeCoin: "mycoinname",
        storeItem: expect.objectContaining({
          id: preCreatedItemId,
          item_name: "item 1",
          value: "200",
          quantity: 5,
          item_image: "",
          description: "My item 1",
          fkstore_id: storeId,
          fkstore_coin: "mycoinname",
          promotion: true,
          promotional_value: "140",
          colors: "red;green",
          sizes: "l",
        }),
      })
    )
  })

  it("should not be possible to get an store item by store and item id if store id or item id are not null on query params.", async () => {
    const getItem = await request(app)
      .get(`/item?storeId=${null}&itemId=${null}`)
      .send()

    expect(getItem.statusCode).toBe(422)
    expect(getItem.body.message).toBe("Invalid store id and item id.")
  })
})
