import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../../app"
import server from "../../../../server"

describe("Remove item from wish list controller", () => {
  beforeAll(async () => {
    await request(app).post("/register").send({
      email: "store@store.com.br",
      password: "123456",
      username: "admin",
    })

    await request(app).post("/register").send({
      email: "user@user.com.br",
      password: "123456",
      username: "admin",
    })
  })

  afterAll(() => {
    server.close()
  })

  it("should be possible to remove an item from user wish list.", async () => {
    const login = await request(app).post("/login").send({
      email: "store@store.com.br",
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
            value: 300,
            quantity: 1,
            description: "My item 2",
            promotion: false,
            promotionalValue: 140,
            itemImage: null,
            colors: "black",
            sizes: "m",
          },
        ],
      })

    const getStoreItemList = await request(app)
      .get(`/list/${getStoreId.body.data.store.id}?page=1`)
      .send()

    const loginAsUser = await request(app).post("/login").send({
      email: "user@user.com.br",
      password: "123456",
    })

    await request(app)
      .post(`/wish-list`)
      .set("Cookie", loginAsUser.headers["set-cookie"][0])
      .send({
        itemId: getStoreItemList.body.items[0].id,
      })

    await request(app)
      .post(`/wish-list`)
      .set("Cookie", loginAsUser.headers["set-cookie"][0])
      .send({
        itemId: getStoreItemList.body.items[1].id,
      })

    const userWishListBeforeRemoving = await request(app)
      .get(`/wish-list`)
      .set("Cookie", loginAsUser.headers["set-cookie"][0])
      .send()

    const removingItem = await request(app)
      .delete(`/wish-list`)
      .set("Cookie", loginAsUser.headers["set-cookie"][0])
      .send({
        itemId: userWishListBeforeRemoving.body.data[0].id,
      })

    const userWishListAfterRemoving = await request(app)
      .get(`/wish-list`)
      .set("Cookie", loginAsUser.headers["set-cookie"][0])
      .send()

    expect(removingItem.statusCode).toEqual(200)

    expect(userWishListAfterRemoving.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: userWishListAfterRemoving.body.data[0].id,
          fkwishlist_item_owner: expect.any(String),
          name: "item 2",
          item_value: "300",
          item_image: "",
          item_id: getStoreItemList.body.items[1].id,
        }),
      ])
    )
  })

  it("should not be possible to remove an item from wish-list without an auth token.", async () => {
    const userWishList = await request(app).delete(`/wish-list`).send()

    expect(userWishList.statusCode).toEqual(403)
    expect(userWishList.body.message).toEqual("Invalid token.")
  })
})
