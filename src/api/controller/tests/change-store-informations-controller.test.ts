import { describe, it, expect, afterAll, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../app"
import server from "../../../server"

describe("Change store informations controller", () => {
  afterAll(() => {
    server.close()
  })

  it("should be possible to update all store informations", async () => {
    await request(app).post("/register").send({
      email: "admin@admin.com.br",
      password: "123456",
      username: "admin",
    })

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
      })

    const profileBeforeEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    await request(app)
      .patch("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeUpdate: {
          storeId: profileBeforeEdit.body.data.store.id,
          name: "update name",
          description: "update description",
        },
      })

    const profileAfterEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(profileAfterEdit.body.data).toEqual(
      expect.objectContaining({
        store: expect.objectContaining({
          id: expect.any(String),
          name: "update name",
          description: "update description",
          storeOwner: "admin@admin.com.br",
        }),
      })
    )
  })

  it("should be possible to update only store name", async () => {
    await request(app).post("/register").send({
      email: "admin2@admin2.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin2@admin2.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
      })

    const profileBeforeEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    await request(app)
      .patch("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeUpdate: {
          storeId: profileBeforeEdit.body.data.store.id,
          name: "store name update",
        },
      })

    const profileAfterEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(profileAfterEdit.body.data).toEqual(
      expect.objectContaining({
        store: expect.objectContaining({
          id: expect.any(String),
          name: "store name update",
          description: "test store description",
          storeOwner: "admin2@admin2.com.br",
        }),
      })
    )
  })

  it("should be possible to update only store description", async () => {
    await request(app).post("/register").send({
      email: "admin3@admin3.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin3@admin3.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
      })

    const profileBeforeEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    await request(app)
      .patch("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeUpdate: {
          storeId: profileBeforeEdit.body.data.store.id,
          description: "update store description",
        },
      })

    const profileAfterEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(profileAfterEdit.body.data).toEqual(
      expect.objectContaining({
        store: expect.objectContaining({
          id: expect.any(String),
          name: "test store",
          description: "update store description",
          storeOwner: "admin3@admin3.com.br",
        }),
      })
    )
  })

  it("should be return current store informations if none parameter are provided.", async () => {
    await request(app).post("/register").send({
      email: "admin4@admin4.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin4@admin4.com.br",
      password: "123456",
    })

    await request(app)
      .post("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeName: "test store",
        storeDescription: "test store description",
      })

    const profileBeforeEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    await request(app)
      .patch("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeUpdate: {
          storeId: profileBeforeEdit.body.data.store.id,
        },
      })

    const profileAfterEdit = await request(app)
      .get("/profile")
      .set("Cookie", login.headers["set-cookie"][0])
      .send()

    expect(profileAfterEdit.body.data).toEqual(
      expect.objectContaining({
        store: expect.objectContaining({
          id: expect.any(String),
          name: "test store",
          description: "test store description",
          storeOwner: "admin4@admin4.com.br",
        }),
      })
    )
  })

  it("should not be possible to update store informations without an valid auth token.", async () => {
    const update = await request(app)
      .patch("/store")
      .send({
        storeUpdate: {
          storeId: "",
        },
      })

    expect(update.statusCode).toBe(403)
    expect(update.body.message).toEqual("Invalid token.")
  })

  it("should not be possible to update store informations if store id doesnt exists.", async () => {
    await request(app).post("/register").send({
      email: "admin4@admin4.com.br",
      password: "123456",
      username: "admin",
    })

    const login = await request(app).post("/login").send({
      email: "admin4@admin4.com.br",
      password: "123456",
    })

    const update = await request(app)
      .patch("/store")
      .set("Cookie", login.headers["set-cookie"][0])
      .send({
        storeUpdate: {
          storeId: "inexistent",
        },
      })

    expect(update.statusCode).toBe(404)
    expect(update.body.message).toEqual("Store id not found.")
  })
})
