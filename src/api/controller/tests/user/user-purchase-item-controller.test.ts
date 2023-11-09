import request from "supertest"
import { describe, it, expect, afterAll, beforeAll } from "vitest"
import server from "../../../../server"
import app from "../../../../app"

describe("User purchase item controller", () => {
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

  it("should be possible to an user 'buy' an item in a store with this store coin.", async () => {
    const storeLogin = await request(app).post("/login").send({
      email: "admin@admin.com.br",
      password: "123456",
    })

    await request(app).post("/register").send({
      email: "userToReceive@email.com.br",
      password: "123456",
      username: "user",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
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
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive@email.com.br",
        valueToGive: 250,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 1,
          },
        ],
      })

    const storeItemsAfterPurchase = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    const getUserProfileAfterPurchase = await request(app)
      .get("/profile")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send()

    expect(storeItemsAfterPurchase.body.items[0].quantity).toBe(4)

    expect(getUserProfileAfterPurchase.body.data.wallet.coins[0].quantity).toEqual(
      "110"
    )

    expect(getUserProfileAfterPurchase.body.data.userItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_name: storeItems.body.items[0].item_name,
          item_value: storeItems.body.items[0].promotional_value,
          quantity: 1,
        }),
      ])
    )

    expect(purchase.statusCode).toBe(204)
  })

  it("should be possible to an user 'buy' an item list in a store with this store coin.", async () => {
    await request(app).post("/register").send({
      email: "admin2@admin2.com.br",
      password: "123456",
      username: "admin",
    })

    const storeLogin = await request(app).post("/login").send({
      email: "admin2@admin2.com.br",
      password: "123456",
    })

    await request(app).post("/register").send({
      email: "userToReceive2@email.com.br",
      password: "123456",
      username: "user",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname2",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
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
            value: 500,
            quantity: 2,
            description: `My item 2`,
            promotion: false,
            promotionalValue: null,
            itemImage: null,
            colors: "blue",
            sizes: "m",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive2@email.com.br",
        valueToGive: 1200,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive2@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 1,
          },
          {
            itemId: storeItems.body.items[1].id,
            itemQuantity: 2,
          },
        ],
      })

    const storeItemsAfterPurchase = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    const getUserProfileAfterPurchase = await request(app)
      .get("/profile")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send()

    expect(storeItemsAfterPurchase.body.items[0].quantity).toBe(4)
    expect(storeItemsAfterPurchase.body.items[1].quantity).toBe(0)

    expect(getUserProfileAfterPurchase.body.data.wallet.coins[0].quantity).toEqual(
      "60"
    )

    expect(getUserProfileAfterPurchase.body.data.userItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_name: storeItems.body.items[0].item_name,
          item_value: storeItems.body.items[0].promotional_value,
          quantity: 1,
        }),
        expect.objectContaining({
          item_name: storeItems.body.items[1].item_name,
          item_value: storeItems.body.items[1].value,
          quantity: 2,
        }),
      ])
    )

    expect(purchase.statusCode).toBe(204)
  })

  it("should be possible to an user 'buy' an item in a store with this store coin and a valid coupon.", async () => {
    await request(app).post("/register").send({
      email: "admin7@admin7.com.br",
      password: "123456",
      username: "admin",
    })

    await request(app).post("/register").send({
      email: "userToReceive7@email.com.br",
      password: "123456",
      username: "user",
    })

    const storeLogin = await request(app).post("/login").send({
      email: "admin7@admin7.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store7",
        storeDescription: "test store description",
        storeCoin: "mycoinname7",
      })

    await request(app)
      .post("/new-coupon")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        active: true,
        coupon_code: "TSX",
        discount: "20",
        validation_date: new Date(2100, 1, 1, 13),
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: `item 1`,
            value: 200,
            quantity: 5,
            description: `My item 1`,
            promotion: false,
            promotionalValue: 140,
            itemImage: null,
            colors: "red;green",
            sizes: "l",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive7@email.com.br",
        valueToGive: 200,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive7@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        couponCode: "TSX",
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 1,
          },
        ],
      })

    const storeItemsAfterPurchase = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    const getUserProfileAfterPurchase = await request(app)
      .get("/profile")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send()

    expect(storeItemsAfterPurchase.body.items[0].quantity).toBe(4)

    expect(getUserProfileAfterPurchase.body.data.wallet.coins[0].quantity).toEqual(
      "40"
    )

    expect(getUserProfileAfterPurchase.body.data.userItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_name: storeItems.body.items[0].item_name,
          item_value: storeItems.body.items[0].value,
          quantity: 1,
        }),
      ])
    )

    expect(purchase.statusCode).toBe(204)
  })

  it("should be possible to an user 'buy' an item in promotion.", async () => {
    await request(app).post("/register").send({
      email: "admin3@admin3.com.br",
      password: "123456",
      username: "admin",
    })

    const storeLogin = await request(app).post("/login").send({
      email: "admin3@admin3.com.br",
      password: "123456",
    })

    await request(app).post("/register").send({
      email: "userToReceive3@email.com.br",
      password: "123456",
      username: "user",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname3",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: `promo item`,
            value: 300,
            quantity: 1,
            description: `My promo item`,
            promotion: true,
            promotionalValue: 100,
            itemImage: null,
            colors: "red;green",
            sizes: "l",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive3@email.com.br",
        valueToGive: 100,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive3@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 1,
          },
        ],
      })

    const storeItemsAfterPurchase = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    const getUserProfileAfterPurchase = await request(app)
      .get("/profile")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send()

    expect(storeItemsAfterPurchase.body.items[0].quantity).toBe(0)

    expect(getUserProfileAfterPurchase.body.data.wallet.coins[0].quantity).toEqual(
      "0"
    )

    expect(getUserProfileAfterPurchase.body.data.userItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_name: storeItems.body.items[0].item_name,
          item_value: storeItems.body.items[0].promotional_value,
          quantity: 1,
        }),
      ])
    )

    expect(purchase.statusCode).toBe(204)
  })

  it("should not be possible to an user 'buy' an item if some item has no quantity available.", async () => {
    await request(app).post("/register").send({
      email: "admin4@admin4.com.br",
      password: "123456",
      username: "admin",
    })

    const storeLogin = await request(app).post("/login").send({
      email: "admin4@admin4.com.br",
      password: "123456",
    })

    await request(app).post("/register").send({
      email: "userToReceive4@email.com.br",
      password: "123456",
      username: "user",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname4",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: `item 1`,
            value: 100,
            quantity: 10,
            description: `My item 1`,
            promotion: false,
            promotionalValue: null,
            itemImage: null,
            colors: "black",
            sizes: "m",
          },
          {
            itemName: `item 2`,
            value: 100,
            quantity: 10,
            description: `My item 2`,
            promotion: false,
            promotionalValue: null,
            itemImage: null,
            colors: "blue",
            sizes: "l",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive4@email.com.br",
        valueToGive: 5000,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive4@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 10,
          },
          {
            itemId: storeItems.body.items[1].id,
            itemQuantity: 11,
          },
        ],
      })

    expect(purchase.status).toBe(409)
    expect(purchase.body.message).toEqual(
      expect.stringContaining("quantity unavailable.")
    )
  })

  it("should not be possible to an user 'buy' an item if user has no total balance to.", async () => {
    await request(app).post("/register").send({
      email: "admin5@admin5.com.br",
      password: "123456",
      username: "admin",
    })

    const storeLogin = await request(app).post("/login").send({
      email: "admin5@admin5.com.br",
      password: "123456",
    })

    await request(app).post("/register").send({
      email: "userToReceive5@email.com.br",
      password: "123456",
      username: "user",
    })

    await request(app)
      .post("/store")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
        storeCoin: "mycoinname5",
      })

    await request(app)
      .post("/store-item")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        itemList: [
          {
            itemName: `item 1`,
            value: 201,
            quantity: 1,
            description: `My item 1`,
            promotion: false,
            promotionalValue: null,
            itemImage: null,
            colors: "black",
            sizes: "m",
          },
        ],
      })

    const getStoreId = await request(app)
      .get("/profile")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send()

    const storeItems = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}`)
      .send()

    await request(app) // Give user coins
      .post("/store-coin")
      .set("Cookie", storeLogin.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive5@email.com.br",
        valueToGive: 200,
      })

    const userLogin = await request(app).post("/login").send({
      email: "userToReceive5@email.com.br",
      password: "123456",
    })

    const purchase = await request(app)
      .post("/checkout/store-item")
      .set("Cookie", userLogin.headers["set-cookie"][0])
      .send({
        storeId: getStoreId.body.data.store.id,
        items: [
          {
            itemId: storeItems.body.items[0].id,
            itemQuantity: 1,
          },
        ],
      })

    expect(purchase.status).toBe(409)
    expect(purchase.body.message).toBe("Invalid user balance.")
  })

  it("should not be possible to an user 'buy' an item if user has no auth token.", async () => {
    const purchase = await request(app)
      .post("/checkout/store-item")
      .send({
        storeId: "any store id",
        items: [
          {
            itemId: "any item id",
            itemQuantity: 1,
          },
        ],
      })

    expect(purchase.status).toBe(403)
    expect(purchase.body.message).toBe("Invalid token.")
  })
})
