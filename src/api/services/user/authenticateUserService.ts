import { compare } from "bcryptjs"
import { UserRepository } from "../../repositories/UserRepository"
import { User } from "../../@types/types"

interface AuthenticateUserServiceRequest {
  email: string
  password: string
}

interface AuthenticateUserServiceResponse {
  isThisUserRegistered: User
}

export default class AuthenticateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    if (!email || !password) {
      throw {
        status: 409,
        error: "You must provide all user informations. E-mail and Password.",
      }
    }

    const isThisUserRegistered = await this.userRepository.findByEmail(email)

    if (!isThisUserRegistered) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const doesPasswordsMatch = await compare(password, isThisUserRegistered.password)

    if (!doesPasswordsMatch) {
      throw {
        status: 403,
        error: "Invalid credentials.",
      }
    }

    return { isThisUserRegistered }
  }
}
