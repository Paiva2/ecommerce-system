import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Get store item list controller", () => {
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

  it("should be possible to get an store item list  by store id.", async () => {
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

    let itemList = []

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

    await request(app)
      .post("/store-item")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        itemList,
      })

    const getStoreItemList = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=3`)
      .send()

    expect(getStoreItemList.statusCode).toEqual(200)
    expect(getStoreItemList.body.items.length).toBe(3)
  })

  it("should be possible to get an store item list  by store id.", async () => {
    const getStoreItemList = await request(app).get(`/list/""?page=3`).send()

    expect(getStoreItemList.statusCode).toEqual(404)
    expect(getStoreItemList.body.message).toEqual("Store id not found.")
  })
})
