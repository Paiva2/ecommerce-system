import { describe, it, expect, beforeEach } from "vitest"
import InMemoryUser from "../../../in-memory/InMemoryUser"
import RegisterNewUserServices from "../../user/registerNewUserService"
import ChangeUserProfileService from "../../user/changeUserProfileService"
import { User } from "../../../@types/types"
import { compare } from "bcryptjs"

let registeredUser: User
let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserServices
let sut: ChangeUserProfileService

describe("Change user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    registerNewUserService = new RegisterNewUserServices(inMemoryUser)
    sut = new ChangeUserProfileService(inMemoryUser)

    const { newUser } = await registerNewUserService.execute({
      email: "test@email.com",
      username: "test user",
      password: "123456",
    })

    registeredUser = newUser
  })

  it("should be possible to change user profile informations dinamically.", async () => {
    // update both infos
    const updatedUser = await sut.execute({
      userEmail: "test@email.com",
      userId: registeredUser.id,
      infosToUpdate: {
        username: "change my username",
        password: "passwordchange",
        oldPassword: "123456",
      },
    })

    const comparePasswordsAfterChange = await compare(
      "passwordchange",
      updatedUser.password
    )

    expect(comparePasswordsAfterChange).toBe(true)
    expect(updatedUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "change my username",
      })
    )

    // updating only the username
    const updateOnlyUsername = await sut.execute({
      userEmail: "test@email.com",
      userId: registeredUser.id,
      infosToUpdate: {
        username: "change my username again",
      },
    })

    const comparePasswordsAfterChangeoOnlyUsername = await compare(
      "passwordchange",
      updatedUser.password
    )

    expect(comparePasswordsAfterChangeoOnlyUsername).toBe(true)
    expect(updateOnlyUsername).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "change my username again",
      })
    )

    // updating only the password
    const updateOnlyMyPassword = await sut.execute({
      userEmail: "test@email.com",
      userId: registeredUser.id,
      infosToUpdate: {
        password: "mynewpass",
        oldPassword: "passwordchange",
      },
    })

    const comparePasswordsAfterChangeThePassword = await compare(
      "mynewpass",
      updateOnlyMyPassword.password
    )

    expect(comparePasswordsAfterChangeThePassword).toBe(true)
  })

  it("should return user current data if none new user infos are passed to update.", async () => {
    const currentUser = await sut.execute({
      userEmail: "test@email.com",
      userId: registeredUser.id,
    })

    const compareIfPasswordChanged = await compare("123456", currentUser.password)

    expect(compareIfPasswordChanged).toBe(true)
    expect(currentUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "test@email.com",
        username: "test user",
      })
    )
  })

  it("should not be possible to change user profile informations if old password dont matches.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "test@email.com",
        userId: registeredUser.id,
        infosToUpdate: {
          username: "change my username",
          password: "passwordchange",
          oldPassword: "wrong current password",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid old password.",
      })
    )
  })

  it("should not be possible to change user profile informations if email or id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "",
        userId: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user informations.",
      })
    )
  })

  it("should not be possible to change user profile informations if user doesnt exists on database.", async () => {
    await expect(() => {
      return sut.execute({
        userEmail: "inexistent@inexistent.com",
        userId: registeredUser.id,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
