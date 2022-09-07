import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)   // No password DTO
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post("/signup")
  createrUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  };

  // Line number 18 and 19 are same, in line 19, we initialized our own decorator
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get("/:id")
  async findUser(@Param("id") id: string) {
    console.log("handler is running");
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("User not found.")
    }
    return user;
  };

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

}
