import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    getUserById(@Query() query: {userId: number}) {
        return this.userService.getUserById(query)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getMe(@Request() req) {
        const {authorization} = req.headers
        const {password, ...resData} = await this.userService.getMe(authorization)
        return resData
    }

}
