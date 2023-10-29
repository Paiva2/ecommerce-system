import { Length, IsEmail, IsDefined, IsString } from "class-validator"

export class RegisterNewUserDTO {
  @IsDefined({ message: "Username can't be empty." })
  @IsString({ message: "Username must be an string value type." })
  username: string

  @IsDefined({ message: "E-mail can't be empty." })
  @IsEmail({}, { message: "Invalid e-mail format. Example: email@domain.com" })
  email: string

  @IsString({ message: "Password must be an string value type." })
  @IsDefined({ message: "Password can't be empty." })
  @Length(6, 999999999, { message: "Password need to have at least 6 characters." })
  password: string
}
