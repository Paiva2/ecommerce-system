import { afterAll, describe, expect, it } from "vitest"
import request from "supertest"
import server from "../../../../server"
import app from "../../../../app"

describe("Update user store coin controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to update user store coins full value", async () => {
    await request(app).post("/register").send({
      email: "store@store.com.br",
      password: "123456",
      username: "store giving",
    })

    const loginAsStore = await request(app).post("/login").send({
      email: "store@store.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        storeName: "store giving",
        storeDescription: "test store description",
        storeCoin: "cointest",
      })

    await request(app).post("/register").send({
      email: "userToReceive@email.com.br",
      password: "123456",
      username: "user receiving",
    })

    // inserting coin before update
    await request(app)
      .post("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive@email.com.br",
        valueToGive: 1000,
      })

    const updatingCoinValueAction = await request(app)
      .patch("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToUpdate: "userToReceive@email.com.br",
        newValue: 100.2,
      })

    const loginAsUserThatReceived = await request(app).post("/login").send({
      email: "userToReceive@email.com.br",
      password: "123456",
    })

    const profileOfUserThatReceived = await request(app)
      .get("/profile")
      .set("Cookie", loginAsUserThatReceived.headers["set-cookie"][0])
      .send()

    expect(updatingCoinValueAction.statusCode).toBe(204)
    expect(profileOfUserThatReceived.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "userToReceive@email.com.br",
        username: "user receiving",
        created_At: expect.any(String),
        store: {},
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: expect.arrayContaining([
            expect.objectContaining({
              coin_name: "cointest",
              quantity: "100.2",
            }),
          ]),
        }),
      })
    )
  })

  it("should only be possible to update user coin values if user already has that coin", async () => {
    await request(app).post("/register").send({
      email: "store2@store2.com.br",
      password: "123456",
      username: "store giving",
    })

    const loginAsStore = await request(app).post("/login").send({
      email: "store2@store2.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        storeName: "store giving",
        storeDescription: "test store description",
        storeCoin: "cointest2",
      })

    await request(app).post("/register").send({
      email: "userToReceive2@email.com.br",
      password: "123456",
      username: "user receiving",
    })

    const updatingCoinValueAction = await request(app)
      .patch("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToUpdate: "userToReceive2@email.com.br",
        newValue: 100.2,
      })

    expect(updatingCoinValueAction.statusCode).toBe(404)
    expect(updatingCoinValueAction.body.message).toEqual(
      "User hasn't this coin, insert some value before update."
    )
  })

  it("should not be possible to update user coins without auth token", async () => {
    const storeCoinUpdate = await request(app).patch("/store-coin").send({
      userToUpdate: "userToReceive2@email.com.br",
      newValue: 1000,
    })

    expect(storeCoinUpdate.statusCode).toBe(403)
    expect(storeCoinUpdate.body.message).toEqual("Invalid token.")
  })
})
