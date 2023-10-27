import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe.skip("Get all Stores Controller", () => {
  beforeAll(async () => {
    await request(app).post("/register").send({
      email: "firstacc@firstacc.com.br",
      password: "123456",
      username: "first acc",
    })

    await request(app).post("/register").send({
      email: "secondacc@secondacc.com.br",
      password: "123456",
      username: "second acc",
    })
  })

  afterAll(() => {
    server.close()
  })

  it("should be possible to get all created stores", async () => {
    const loginOnFirstAcc = await request(app).post("/login").send({
      email: "firstacc@firstacc.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", loginOnFirstAcc.headers["set-cookie"][0])
      .send({
        storeName: "first store",
        storeCoin: "mycoinname",
        storeDescription: "test",
      })

    const loginOnSecondAcc = await request(app).post("/login").send({
      email: "secondacc@secondacc.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", loginOnSecondAcc.headers["set-cookie"][0])
      .send({
        storeName: "second store",
        storeCoin: "mycoinname2",
        storeDescription: "test",
      })

    const getStores = await request(app).get("/store").send()

    expect(getStores.statusCode).toBe(200)
    expect(getStores.body).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            name: "first store",
            storeOwner: "firstacc@firstacc.com.br",
            store_coin: "mycoinname",
            description: "test",
          }),
          expect.objectContaining({
            name: "second store",
            storeOwner: "secondacc@secondacc.com.br",
            store_coin: "mycoinname2",
            description: "test",
          }),
        ]),
      })
    )
  })
})
