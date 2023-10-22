import { hash } from "bcryptjs"
import { User } from "../../@types/types"
import { UserRepository } from "../../repositories/UserRepository"

interface ChangePasswordUserServiceRequest {
  email: string
  newPassword: string
}

interface ChangePasswordUserServiceResponse {
  updatedUser: User
}

export default class ChangePasswordUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    newPassword,
  }: ChangePasswordUserServiceRequest): Promise<ChangePasswordUserServiceResponse> {
    if (!email || !newPassword) {
      throw {
        status: 409,
        error: "You must provide all informations. Email and password.",
      }
    } else if (newPassword.length < 6) {
      throw {
        status: 403,
        error: "Password must have at least 6 characters.",
      }
    }

    const findUser = await this.userRepository.findByEmail(email)

    if (!findUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const hashNewPassword = await hash(newPassword, 6)

    const updatedUser = await this.userRepository.update(email, hashNewPassword)

    return { updatedUser }
  }
}
