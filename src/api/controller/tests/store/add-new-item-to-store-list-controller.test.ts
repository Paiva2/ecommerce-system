import request from "supertest"
import { describe, it, expect, afterAll, beforeAll } from "vitest"
import server from "../../../../server"
import app from "../../../../app"

describe("Add new item to store list controller", () => {
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

  it("should be possible to insert an list of items on a store.", async () => {
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

    const insertItemList = await request(app)
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
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getItemList = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    expect(insertItemList.statusCode).toEqual(201)
    expect(getItemList.body.items.length).toBe(1)

    expect(getItemList.body).toEqual(
      expect.objectContaining({
        page: 1,
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
  })

  it("should return page 1 as default if page query are not provided.", async () => {
    await request(app).post("/register").send({
      email: "admin2@email.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin2@email.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store 2",
        storeDescription: "test store description",
        storeCoin: "mycoinname2",
      })

    const insertItemList = await request(app)
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
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getItemList = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    expect(insertItemList.statusCode).toEqual(201)
    expect(getItemList.body.items.length).toBe(1)

    expect(getItemList.body).toEqual(
      expect.objectContaining({
        page: 1,
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
  })

  it("should be possible to get store item list by page query.", async () => {
    await request(app).post("/register").send({
      email: "admin3@email.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin3@email.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store 3",
        storeDescription: "test store description",
        storeCoin: "mycoinname3",
      })

    const itemList = []

    for (let i = 1; i <= 23; i++) {
      itemList.push({
        itemName: `item ${i}`,
        value: 200,
        quantity: 5,
        description: `My item ${i}`,
        promotion: true,
        promotionalValue: 140,
        itemImage: null,
        colors: "red;green",
        sizes: "l",
      })
    }

    const insertItemList = await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList,
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getItemList = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=3`)
      .send()

    expect(insertItemList.statusCode).toEqual(201)
    expect(getItemList.body.items.length).toBe(3)
  })
})
