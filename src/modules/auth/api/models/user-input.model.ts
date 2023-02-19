import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class UserInputModel {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(3)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  password: string;
  @IsNotEmpty()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
