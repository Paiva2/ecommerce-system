import { Expose, Type } from "class-transformer"
import {
  Length,
  IsEmail,
  IsDefined,
  IsString,
  ValidateIf,
  IsNumber,
  Min,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from "class-validator"
import "reflect-metadata"

export class RegisterNewUserDTO {
  @IsDefined({ message: "username; Can't be empty." })
  @IsString({ message: "username; Must be an string type." })
  username: string

  @IsDefined({ message: "email; Can't be empty." })
  @IsEmail(
    {},
    { message: "email; Invalid e-mail format. Example: email@domain.com" }
  )
  email: string

  @IsDefined({ message: "password; Can't be empty." })
  @IsString({ message: "password; Must be an string type." })
  @Length(6, Infinity, { message: "password; Must have at least 6 characters." })
  password: string
}

export class ChangeUserPasswordDTO {
  @IsDefined({ message: "email; can't be empty." })
  @IsEmail(
    {},
    { message: "email; Invalid e-mail format. Example: email@domain.com" }
  )
  email: string

  @IsDefined({ message: "newPassword; Can't be empty." })
  @IsString({ message: "newPassword; Must be an string type." })
  @Length(6, Infinity, { message: "newPassword; Must have at least 6 characters." })
  newPassword: string
}

export class AuthenticateUserControllerDTO {
  @IsDefined({ message: "email; Can't be empty." })
  @IsEmail(
    {},
    { message: "email; Invalid e-mail format. Example: email@domain.com" }
  )
  email: string

  @IsString({ message: "password; Must be an string type." })
  @IsDefined({ message: "password; Can't be empty." })
  @Length(6, Infinity, { message: "password; Must have at least 6 characters." })
  password: string
}

export class ChangeUserProfileDTO {
  @IsDefined({ message: "username; Can't be empty." })
  @IsString({ message: "username; Must be an string type." })
  @ValidateIf((thisDto) => thisDto.username === null || thisDto.username)
  username?: string

  @ValidateIf((thisDto) => thisDto.password || thisDto.password === null)
  @IsString({ message: "password; Must be an string type." })
  @Length(6, Infinity, { message: "password; Must have at least 6 characters." })
  password?: string

  @ValidateIf((thisDto) => thisDto.password)
  @IsDefined({ message: "oldPassword; Can't be empty." })
  @IsString({ message: "oldPassword; Must be an string type." })
  @Length(6, Infinity, {
    message: "oldPassword; Must have at least 6 characters.",
  })
  oldPassword?: string
}

class UserPurchaseItemList {
  @IsDefined({ message: "itemId; Can't be empty." })
  @IsString({ message: "itemId; Must be an string type." })
  @Length(1, Infinity, { message: "itemId; Can't be empty." })
  itemId: string

  @IsDefined({ message: "itemQuantity; Can't be empty." })
  @IsNumber({}, { message: "itemQuantity; Must be an number type." })
  @Min(1, { message: "itemQuantity; Can't be less than 1." })
  itemQuantity: number
}

export class UserPurchaseItemControllerDTO {
  @IsDefined({ message: "storeId; Can't be empty." })
  @IsString({ message: "storeId; Must be an string type." })
  @Length(1, Infinity, { message: "storeId; Can't be empty." })
  storeId: string

  @Expose()
  @IsArray({ message: "items; Should be an array of objecs." })
  @ValidateNested({ each: true, message: "items; Invalid item list schema." })
  @ArrayMinSize(1, { message: "items; Can't be empty." })
  @Type(() => UserPurchaseItemList)
  items: UserPurchaseItemList
}

export class InsertItemToWishListControllerDTO {
  @IsDefined({ message: "itemId; Can't be empty." })
  @IsString({ message: "itemId; Must be an string type." })
  @Length(1, Infinity, { message: "itemId; Can't be empty." })
  itemId: string
}

export class RemoveItemFromWishListControllerDTO {
  @IsDefined({ message: "itemId; Can't be empty." })
  @IsString({ message: "itemId; Must be an string type." })
  @Length(1, Infinity, { message: "itemId; Can't be empty." })
  itemId: string
}

export class RemoveStoreItemFromListControllerDTO {
  @IsDefined({ message: "itemId; Can't be empty." })
  @IsString({ message: "itemId; Must be an string type." })
  @Length(1, Infinity, { message: "itemId; Can't be empty." })
  itemId: string
}
