import { IsNotEmpty } from "class-validator";

export class LoginInputModel {
  @IsNotEmpty()
  readonly loginOrEmail: string;
  @IsNotEmpty()
  readonly password: string;
}