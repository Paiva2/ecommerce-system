import { compare, hash } from "bcryptjs"
import { User } from "../../@types/types"
import { UserRepository } from "../../repositories/UserRepository"

interface ChangeUserProfileServiceRequest {
  userEmail: string
  userId: string
  infosToUpdate?: { username?: string; password?: string; oldPassword?: string }
}

type ChangeUserProfileServiceResponse = User

export default class ChangeUserProfileService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userEmail,
    userId,
    infosToUpdate,
  }: ChangeUserProfileServiceRequest): Promise<ChangeUserProfileServiceResponse> {
    if (!userEmail || !userId) {
      throw {
        status: 403,
        error: "Invalid user informations.",
      }
    }

    const doesUserExists = await this.userRepository.findByEmail(userEmail)

    if (!doesUserExists) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    if (!infosToUpdate) return doesUserExists

    if (infosToUpdate.password) {
      const checkIfOldPasswordMatches = await compare(
        infosToUpdate.oldPassword,
        doesUserExists.password
      )

      if (!checkIfOldPasswordMatches) {
        throw {
          status: 403,
          error: "Invalid old password.",
        }
      }

      infosToUpdate.password = await hash(infosToUpdate.password, 6)
    }

    const updatedUser = await this.userRepository.updateUserProfile(
      userId,
      userEmail,
      infosToUpdate
    )

    return updatedUser
  }
}
