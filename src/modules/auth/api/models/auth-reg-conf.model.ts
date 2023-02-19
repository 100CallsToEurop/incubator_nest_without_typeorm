import { IsNotEmpty } from "class-validator";

export class RegistrationConfirmationCodeModel{
    @IsNotEmpty()
    code: string
}