import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Remove store item from list controller", () => {
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

  it("should be possible to remove one item from my store with item id.", async () => {
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

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList: [
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
          {
            itemName: `item 2`,
            value: 250,
            quantity: 1,
            description: `My item 2`,
            promotion: false,
            promotionalValue: 150,
            itemImage: null,
            colors: "black",
            sizes: "m",
          },
        ],
      })

    const getStoreItemListBeforeRemovingItem = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    const [firstItem, secondItem] = getStoreItemListBeforeRemovingItem.body.items

    const removeItemReq = await request(app)
      .delete("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemId: firstItem.id,
      })

    const getStoreItemListAfterRemovingItem = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    expect(removeItemReq.statusCode).toEqual(200)
    expect(getStoreItemListAfterRemovingItem.body.items[0]).toEqual(
      expect.objectContaining({
        id: secondItem.id,
        item_name: secondItem.item_name,
        value: secondItem.value,
        quantity: secondItem.quantity,
        item_image: secondItem.item_image,
        description: secondItem.description,
        promotion: secondItem.promotion,
        promotional_value: secondItem.promotional_value,
        colors: secondItem.colors,
        sizes: secondItem.sizes,
      })
    )
  })

  it("should not be possible to remove an store item from my store without having a created store.", async () => {
    await request(app).post("/register").send({
      email: "nostore@nostore.com.br",
      password: "123456",
      username: "nostore",
    })

    const login = await request(app).post("/login").send({
      email: "nostore@nostore.com.br",
      password: "123456",
    })

    const removeItemReq = await request(app)
      .delete("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemId: "any item id",
      })

    expect(removeItemReq.statusCode).toEqual(404)
    expect(removeItemReq.body.message).toEqual("Store not found.")
  })

  it("should not be possible to remove an store item from my store without beeing auth.", async () => {
    const getStoreItemList = await request(app).delete(`/store-item`).send()

    expect(getStoreItemList.statusCode).toEqual(403)
    expect(getStoreItemList.body.message).toEqual("Invalid token.")
  })
})
