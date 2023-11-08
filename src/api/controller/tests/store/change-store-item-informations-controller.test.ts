import request from "supertest"
import { describe, it, expect, afterAll, beforeAll } from "vitest"
import server from "../../../../server"
import app from "../../../../app"

describe("Change Store item informations controller", () => {
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

  it("should be possible to update an store item information.", async () => {
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

    await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: "item 1",
            value: 200,
            quantity: 5,
            description: "My item 1",
            promotion: true,
            promotionalValue: 140,
            itemImage: null,
            colors: "red;green",
            sizes: "l",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getItemListBeforeUpdate = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    //before updating
    expect(getItemListBeforeUpdate.body).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            item_name: "item 1",
            value: "200",
            quantity: 5,
            description: "My item 1",
            promotion: true,
            promotional_value: "140",
            colors: "red;green",
            sizes: "l",
            fkstore_id: getStoreId.body.data.store.id,
          }),
        ]),
      })
    )

    const update = await request(app)
      .patch("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemId: getItemListBeforeUpdate.body.items[0].id,
        informationsToUpdate: {
          item_name: "update name",
          value: 100,
          quantity: 20,
          description: "updating description",
          promotion: false,
        },
      })

    const getItemListAfterUpdate = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    // after update
    expect(getItemListAfterUpdate.body).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            item_name: "update name",
            value: "100",
            quantity: 20,
            description: "updating description",
            promotion: false,
            fkstore_id: getStoreId.body.data.store.id,
          }),
        ]),
      })
    )

    expect(update.statusCode).toBe(204)
  })

  it("should not be possible to update an store item information if item isnt from your store.", async () => {
    await request(app).post("/register").send({
      email: "admin1@admin1.com.br",
      password: "123456",
      username: "admin",
    })

    await request(app).post("/register").send({
      email: "otherstore@otherstore.com.br",
      password: "123456",
      username: "otherstore",
    })

    const login = await request(app).post("/login").send({
      email: "admin1@admin1.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname1",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: "item 1",
            value: 200,
            quantity: 5,
            description: "My item 1",
            promotion: true,
            promotionalValue: 140,
            itemImage: null,
            colors: "red;green",
            sizes: "l",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getItemListBeforeUpdate = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    const itemListFromOtherStore = getItemListBeforeUpdate.body.items[0].id

    const otherStoreLogin = await request(app).post("/login").send({
      email: "otherstore@otherstore.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", otherStoreLogin.headers["set-cookie"][0])
      .send({
        storeName: "test other store",
        storeDescription: "test store description",
        storeCoin: "mycoinname2",
      })

    const update = await request(app)
      .patch("/store-item")
      .set("Cookie", otherStoreLogin.headers["set-cookie"][0])
      .send({
        itemId: itemListFromOtherStore,
        informationsToUpdate: {
          item_name: "update name",
        },
      })

    expect(update.statusCode).toBe(404)
    expect(update.body.message).toBe("Item not found.")
  })

  it("should not be possible to update an store item information without auth token.", async () => {
    const update = await request(app)
      .patch("/store-item")
      .send({
        itemId: "any item id",
        informationsToUpdate: {
          item_name: "update name",
        },
      })

    expect(update.statusCode).toBe(403)
    expect(update.body.message).toBe("Invalid token.")
  })
})
