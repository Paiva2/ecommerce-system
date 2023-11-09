import {
  IsDefined,
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  MinLength,
  ValidateNested,
  IsArray,
  Length,
  IsBoolean,
  ValidateIf,
  ArrayMinSize,
  IsObject,
  IsNumberString,
  IsDateString,
} from "class-validator"
import { Expose, Type } from "class-transformer"
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

export class AddNewItemToStoreLIstSchema {
  @IsDefined({ message: "itemName; Can't be empty." })
  @IsString({ message: "itemName; Must be an string type." })
  @Length(1, Infinity, {
    message: "itemName;  Must have at least 1 character.",
  })
  itemName: string

  @IsDefined({ message: "value; Can't be empty." })
  @IsNumber({}, { message: "value; Must be an number type." })
  @Min(1, { message: "value; Can't be less than 1." })
  value: number

  @IsDefined({ message: "quantity; Can't be empty." })
  @IsNumber({}, { message: "quantity; Must be an number type." })
  @Min(1, { message: "quantity; Can't be less than 1." })
  quantity: number

  @IsDefined({ message: "description; Can't be empty." })
  @IsString({ message: "description; Must be an string type." })
  @Length(1, Infinity, {
    message: "description; Must have at least 1 character.",
  })
  description: string

  @IsDefined({ message: "promotion; Can't be empty." })
  @IsBoolean({ message: "promotion; Must be an true/false (Boolean)." })
  promotion: boolean

  @ValidateIf((props) => props.promotion === true)
  @IsDefined({ message: "promotionalValue; Can't be empty." })
  @IsNumber({}, { message: "promotionalValue; Must be an number type." })
  @Min(0, { message: "promotionalValue; Can't be less than 0." })
  promotionalValue: number

  @IsString({ message: "itemImage; Must be an string type." })
  @IsOptional()
  itemImage: string

  @IsDefined({ message: "colors; Can't be empty." })
  @IsString({ message: "colors; Must be an string type." })
  colors: string

  @IsDefined({ message: "sizes; Can't be empty." })
  @IsString({ message: "sizes; Must be an string type." })
  sizes: string
}

export class AddNewItemToStoreListDTO {
  @IsOptional()
  @Expose()
  @IsArray({ message: "itemList; Should be an array of objecs." })
  @ValidateNested({ each: true, message: "itemList; Invalid item list schema." })
  @ArrayMinSize(1, { message: "itemList; Can't be empty." })
  @Type(() => AddNewItemToStoreLIstSchema)
  itemList: AddNewItemToStoreLIstSchema
}

class ChangeStoreItemInformationsControllerInformationsToUpdate {
  @IsOptional()
  @IsString({ message: "item_name; Must be an string type." })
  item_name: string

  @IsOptional()
  @IsNumber({}, { message: "value; Must be an number type." })
  @Min(1, { message: "value; Can't be less than 1." })
  value: number

  @IsOptional()
  @IsNumber({}, { message: "quantity; Must be an number type." })
  @Min(1, { message: "quantity; Can't be less than 1." })
  quantity: number

  @IsOptional()
  @IsString({ message: "description; Must be an string type." })
  description: string

  @IsOptional()
  @IsString({ message: "colors; Must be an string type." })
  colors: string

  @IsOptional()
  @IsString({ message: "sizes; Must be an string type." })
  sizes: string

  @IsOptional()
  @IsString({ message: "item_image; Must be an string type." })
  item_image: string

  @IsOptional()
  @IsBoolean({ message: "promotion; Must be an true/false (Boolean)." })
  promotion: boolean

  @IsOptional()
  @ValidateIf((props) => props.promotion === true)
  @IsNumber({}, { message: "promotional_value; Must be an number type." })
  @Min(1, { message: "promotional_value; Can't be less than 1." })
  promotional_value: number
}

export class ChangeStoreItemInformationsControllerDTO {
  @IsDefined({ message: "itemId; Can't be empty." })
  @IsString({ message: "itemId; Must be an string type." })
  @Length(1, Infinity, {
    message: "itemId;  Must have at least 1 character.",
  })
  itemId: string

  @IsDefined({ message: "informationsToUpdate; Can't be empty." })
  @IsObject({ message: "informationsToUpdate; Should be an object." })
  @Expose()
  @ValidateNested()
  @Type(() => ChangeStoreItemInformationsControllerInformationsToUpdate)
  informationsToUpdate: ChangeStoreItemInformationsControllerInformationsToUpdate
}

export class CreateStoreCouponControllerDTO {
  @IsDefined({ message: "active; Can't be empty." })
  @IsBoolean({ message: "active; Must be an boolean type." })
  active: boolean

  @IsDefined({ message: "coupon_code; Can't be empty." })
  @IsString({ message: "coupon_code; Must be an string type." })
  @Length(1, Infinity, {
    message: "coupon_code;  Must have at least 1 character.",
  })
  coupon_code: string

  @IsDefined({ message: "discount; Can't be empty." })
  @IsNumberString(
    {},
    { message: "discount; Must be an string with an number type." }
  )
  @Length(1, Infinity, {
    message: "discount;  Must have at least 1 character.",
  })
  discount: string

  @IsDefined({ message: "validation_date; Can't be empty." })
  @IsDateString({}, { message: "validation_date; Must be an string type." })
  @Length(1, Infinity, {
    message: "validation_date;  Must have at least 1 character.",
  })
  validation_date: Date
}

export class ChangeStoreCouponInformations {
  @IsOptional()
  @IsBoolean({ message: "active; Must be an boolean (true/false)." })
  active: boolean

  @IsOptional()
  @IsString({ message: "coupon_code; Must be an string type." })
  @Length(1, Infinity, {
    message: "coupon_code;  Must have at least 1 character.",
  })
  coupon_code: string

  @IsOptional()
  @IsNumberString({}, { message: "discount; Must be an string with an number." })
  @IsString({ message: "discount; Must be an string type." })
  discount: string

  @IsOptional()
  @IsDateString({}, { message: "validation_date; Must be an string type." })
  @Length(1, Infinity, {
    message: "validation_date;  Must have at least 1 character.",
  })
  validation_date: Date
}

export class ChangeCouponInformationsControllerDTO {
  @IsDefined({ message: "couponId; Can't be empty." })
  @IsString({ message: "couponId; Must be an string type." })
  @Length(1, Infinity, {
    message: "couponId;  Must have at least 1 character.",
  })
  couponId: string

  @IsObject()
  @IsDefined({ message: "infosToUpdate; Can't be empty." })
  @ValidateNested({ each: true })
  @Type(() => ChangeStoreCouponInformations)
  @Expose()
  infosToUpdate: ChangeStoreCouponInformations
}
