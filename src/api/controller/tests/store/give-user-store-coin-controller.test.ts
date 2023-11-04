import { afterAll, describe, expect, it } from "vitest"
import request from "supertest"
import server from "../../../../server"
import app from "../../../../app"

describe("Give user store coin controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to give an user my store coins", async () => {
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
        storeCoin: "mycoingived",
      })

    await request(app).post("/register").send({
      email: "userToReceive@email.com.br",
      password: "123456",
      username: "user receiving",
    })

    const givingCoinAction = await request(app)
      .post("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive@email.com.br",
        valueToGive: 1000,
      })

    const loginAsUserThatReceived = await request(app).post("/login").send({
      email: "userToReceive@email.com.br",
      password: "123456",
    })

    const profileOfUserThatReceived = await request(app)
      .get("/profile")
      .set("Cookie", loginAsUserThatReceived.headers["set-cookie"][0])
      .send()

    expect(givingCoinAction.statusCode).toBe(204)
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
              coin_name: "mycoingived",
              quantity: 1000,
            }),
          ]),
        }),
      })
    )
  })

  it("should be possible to add an user store coins if user already has that store coins", async () => {
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
        storeName: "store giving 2",
        storeDescription: "test store description",
        storeCoin: "mycoingived2",
      })

    await request(app).post("/register").send({
      email: "userToReceive2@email.com.br",
      password: "123456",
      username: "user receiving",
    })

    await request(app)
      .post("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive2@email.com.br",
        valueToGive: 1000,
      })

    const addingCoinAction = await request(app)
      .post("/store-coin")
      .set("Cookie", loginAsStore.headers["set-cookie"][0])
      .send({
        userToReceive: "userToReceive2@email.com.br",
        valueToGive: 5000,
      })

    const loginAsUserThatReceived = await request(app).post("/login").send({
      email: "userToReceive2@email.com.br",
      password: "123456",
    })

    const profileOfUserThatReceived = await request(app)
      .get("/profile")
      .set("Cookie", loginAsUserThatReceived.headers["set-cookie"][0])
      .send()

    expect(addingCoinAction.statusCode).toBe(204)
    expect(profileOfUserThatReceived.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "userToReceive2@email.com.br",
        username: "user receiving",
        created_At: expect.any(String),
        store: {},
        wallet: expect.objectContaining({
          id: expect.any(String),
          fkwallet_owner: expect.any(String),
          coins: expect.arrayContaining([
            expect.objectContaining({
              coin_name: "mycoingived2",
              quantity: 6000,
            }),
          ]),
        }),
      })
    )
  })

  it("should not be possible to give user coins without auth token", async () => {
    const storeCoinGiving = await request(app).post("/store-coin").send({
      userToReceive: "userToReceive2@email.com.br",
      valueToGive: 1000,
    })

    expect(storeCoinGiving.statusCode).toBe(403)
    expect(storeCoinGiving.body.message).toEqual("Invalid token.")
  })
})
