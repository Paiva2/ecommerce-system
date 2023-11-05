import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Get single store controller", () => {
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

  it("should be possible to get an store by id.", async () => {
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

    const getStore = await request(app)
      .get(`/store/${getStoreId.body.data.store.id}`)
      .send()

    expect(getStore.statusCode).toEqual(200)
    expect(getStore.body).toEqual(
      expect.objectContaining({
        id: getStoreId.body.data.store.id,
        name: "test store",
        storeOwner: "admin@admin.com.br",
        description: "test store description",
        created_At: expect.any(String),
        updated_at: expect.any(String),
        store_coin: expect.objectContaining({
          id: expect.any(String),
          store_coin_name: "mycoinname",
          fkstore_coin_owner: getStoreId.body.data.store.id,
          created_At: expect.any(String),
          updated_at: expect.any(String),
        }),
        store_item: [],
      })
    )
  })

  it("should be possible to get an store that has store items by id.", async () => {
    await request(app).post("/register").send({
      email: "testuser@email.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "testuser@email.com.br",
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

          {
            itemName: "item 2",
            value: 500,
            quantity: 1,
            description: "My item 2",
            promotion: false,
            promotionalValue: 0,
            itemImage: null,
            colors: "red;green",
            sizes: "m",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    const getStore = await request(app)
      .get(`/store/${getStoreId.body.data.store.id}`)
      .send()

    expect(getStore.statusCode).toEqual(200)
    expect(getStore.body).toEqual(
      expect.objectContaining({
        id: getStoreId.body.data.store.id,
        name: "test store 2",
        storeOwner: "testuser@email.com.br",
        description: "test store description",
        created_At: expect.any(String),
        updated_at: expect.any(String),
        store_coin: expect.objectContaining({
          id: expect.any(String),
          store_coin_name: "mycoinname2",
          fkstore_coin_owner: getStoreId.body.data.store.id,
          created_At: expect.any(String),
          updated_at: expect.any(String),
        }),
        store_item: [
          {
            id: expect.any(String),
            item_name: "item 1",
            value: "200",
            quantity: 5,
            item_image: "",
            description: "My item 1",
            fkstore_id: getStoreId.body.data.store.id,
            updated_at: expect.any(String),
            created_at: expect.any(String),
            fkstore_coin: "mycoinname2",
            promotional_value: "140",
            promotion: true,
            colors: "red;green",
            sizes: "l",
          },
          {
            id: expect.any(String),
            item_name: "item 2",
            value: "500",
            quantity: 1,
            item_image: "",
            description: "My item 2",
            fkstore_id: getStoreId.body.data.store.id,
            updated_at: expect.any(String),
            created_at: expect.any(String),
            fkstore_coin: "mycoinname2",
            promotional_value: "0",
            promotion: false,
            colors: "red;green",
            sizes: "m",
          },
        ],
      })
    )
  })

  it("should not be possible to get an store by id without an store id.", async () => {
    const getStore = await request(app).get(`/store/""`).send()

    expect(getStore.statusCode).toEqual(404)
    expect(getStore.body.message).toEqual("Store not found.")
  })
})
