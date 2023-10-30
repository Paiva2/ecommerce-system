import {
  IsDefined,
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  MinLength,
} from "class-validator"
import { Expose } from "class-transformer"
import "reflect-metadata"

export class CreateNewStoreDTO {
  @IsDefined({ message: "storeName; Can't be empty." })
  @MinLength(1, { message: "storeName; Can't be empty." })
  @IsString({ message: "storeName; Must be an string type." })
  storeName: string

  @IsOptional()
  @IsDefined({ message: "storeDescription; Can't be empty." })
  @IsString({ message: "storeDescription; Must be an string type." })
  storeDescription: string

  @IsDefined({ message: "storeCoin; Can't be empty." })
  @MinLength(1, { message: "storeCoin; Can't be empty." })
  @IsString({ message: "storeCoin; Must be an string type." })
  storeCoin: string
}

export class ChangeStoreInformationsDTO {
  @IsDefined({ message: "storeId; Can't be empty." })
  @IsString({ message: "storeId; Must be an string type." })
  @MinLength(1, { message: "storeId; Can't be empty." })
  @Expose()
  storeId: string

  @IsOptional()
  @IsDefined({ message: "description; Can't be empty." })
  @IsString({ message: "description; Must be an string type." })
  @Expose()
  description: string

  @IsOptional()
  @IsDefined({ message: "name; Can't be empty." })
  @IsString({ message: "name; Must be an string type." })
  @Expose()
  name: string
}
export class GiveUserStoreCoinDTO {
  @IsDefined({ message: "valueToGive; Can't be empty." })
  @IsNumber({}, { message: "valueToGive; Must be an number type." })
  @Min(1, { message: "valueToGive; Can't be less than 1." })
  valueToGive: number

  @IsDefined({ message: "userToReceive; Can't be empty." })
  @IsString({ message: "userToReceive; Must be an string type." })
  @IsEmail(
    {},
    { message: "userToReceive; Invalid e-mail format. Example: email@domain.com." }
  )
  userToReceive: string
}

export class UpdateUserStoreCoinDTO {
  @IsDefined({ message: "newValue; Can't be empty." })
  @IsNumber({}, { message: "newValue; Must be an number type." })
  @Min(0, { message: "newValue; Can't be less than 0." })
  newValue: number

  @IsDefined({ message: "userToUpdate; Can't be empty." })
  @IsString({ message: "userToUpdate; Must be an string type." })
  @IsEmail(
    {},
    { message: "userToUpdate; Invalid e-mail format. Example: email@domain.com." }
  )
  userToUpdate: string
}
