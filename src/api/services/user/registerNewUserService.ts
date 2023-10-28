import { User } from "../../@types/types"
import { UserRepository } from "../../repositories/UserRepository"
import { hash } from "bcryptjs"
import WalletRepository from "../../repositories/WalletRepository"

interface RegisterNewUserServiceRequest {
  username: string
  password: string
  email: string
}

interface RegisterNewUserServiceResponse {
  newUser: User
}

export default class RegisterNewUserServices {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository
  ) {}

  async execute({
    email,
    password,
    username,
  }: RegisterNewUserServiceRequest): Promise<RegisterNewUserServiceResponse> {
    if (!email || !password || !username) {
      throw {
        status: 409,
        error: "You must provide all informations. Username, email and password.",
      }
    } else if (password.length < 6) {
      throw {
        status: 403,
        error: "Password must have at least 6 characters.",
      }
    }

    const isThisUserAlreadyRegistered = await this.userRepository.findByEmail(email)

    if (isThisUserAlreadyRegistered) {
      throw {
        status: 409,
        error: "User is already registered.",
      }
    }

    const hashedPassword = await hash(password, 6)

    const userCreated = await this.userRepository.insert(
      email,
      username,
      hashedPassword
    )

    const newUserWallet = await this.walletRepository.create(userCreated.id)

    const newUser = {
      ...userCreated,
      wallet: newUserWallet,
    }

    return { newUser }
  }
}
