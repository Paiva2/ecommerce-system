import { Length, IsEmail, IsDefined, IsString, ValidateIf } from "class-validator"

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
