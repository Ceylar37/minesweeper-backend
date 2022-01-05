import {Body, Controller, Post, Response, Request, Get} from '@nestjs/common';
import {UserDto} from "../user/dto/user.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    async login(@Body() dto: UserDto, @Response() res) {
        const {refreshToken, ...resData} = await this.authService.login(dto)
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(resData)
    }

    @Post('/registration')
    async registration(@Body() dto: CreateUserDto, @Response() res) {
        const {refreshToken, ...resData} = await this.authService.registration(dto)
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(resData)
    }

    @Post('/logout')
    async logout(@Request() req, @Response() res) {
        const {refreshToken} = req.cookies
        await this.authService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.send(200);
    }

    @Get('/refresh')
    async refresh(@Request() req, @Response() res) {
        const {refreshToken} = req.cookies
        const {refreshToken: newToken, ...resData} = await this.authService.refresh(refreshToken)
        res.cookie('refreshToken', newToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(resData)
    }
}
