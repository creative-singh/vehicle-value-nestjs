// DTO's are used to validation incoming requests bodies

import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}