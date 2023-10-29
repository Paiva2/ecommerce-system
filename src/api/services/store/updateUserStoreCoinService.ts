import { UserCoin } from "../../@types/types"
import { StoreCoinRepository } from "../../repositories/StoreCoinRepository"
import { StoreRepository } from "../../repositories/StoreRepository"
import UserCoinRepository from "../../repositories/UserCoinRepository"
import { UserRepository } from "../../repositories/UserRepository"
import WalletRepository from "../../repositories/WalletRepository"

interface UpdateUserStoreCoinServiceRequest {
  storeId: string
  newValue: number
  userToUpdate: string
}

interface UpdateUserStoreCoinServiceResponse {
  userCoinUpdated: UserCoin
}

export default class UpdateUserStoreCoinService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private storeCoinRepository: StoreCoinRepository,
    private userCoinRepository: UserCoinRepository,
    private walletRepository: WalletRepository
  ) {}

  async execute({
    newValue,
    storeId,
    userToUpdate,
  }: UpdateUserStoreCoinServiceRequest): Promise<UpdateUserStoreCoinServiceResponse> {
    if (!storeId) {
      throw {
        status: 403,
        error: "You must provide an valid store id.",
      }
    }

    const getStore = await this.storeRepository.findUniqueById(storeId)

    const getUser = await this.userRepository.findByEmail(userToUpdate)

    if (!getStore) {
      throw {
        status: 404,
        error: "Store not found.",
      }
    } else if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const { store_coin_name: storeCoinName } =
      await this.storeCoinRepository.findStoreCoin(getStore.id)

    const wallet = await this.walletRepository.findUserWallet(getUser.id)

    const userCoinUpdated = await this.userCoinRepository.updateFullValue(
      newValue,
      wallet.id,
      storeCoinName
    )

    return { userCoinUpdated }
  }
}
