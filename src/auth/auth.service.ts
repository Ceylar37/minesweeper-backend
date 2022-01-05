import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserDto} from "../user/dto/user.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {UserModel} from "../models/user.model";

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
                private jwtService: JwtService) {
    }

    async login(dto: UserDto) {
        const user = await this.validateUser(dto)
        return this.generateAndSaveTokens(user)
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getUserByLogin(dto.login)
        if (candidate)
            throw new HttpException('User with this login already exists', HttpStatus.BAD_REQUEST)
        const hashPassword = await bcrypt.hash(dto.password, 5)
        const user = await this.userService.createUser({login: dto.login, password: hashPassword})
        return this.generateAndSaveTokens(user)
    }

    private async generateTokens(user: UserModel) {
        const payload = {login: user.login, password: user.password, id: user.id, easyGamesWonCount: user.easyGamesWonCount, mediumGamesWonCount: user.mediumGamesWonCount, hardGamesWonCount: user.hardGamesWonCount}
        return {
            accessToken: this.jwtService.sign(payload, {secret: process.env.ACCESS_KEY || 'SECRET', expiresIn: '15d'}),
            refreshToken: this.jwtService.sign(payload, {secret: process.env.REFRESH_KEY || 'SECRET', expiresIn: '30d'})
        }
    }

    private async validateUser(dto: UserDto) {
        const user = await this.userService.getUserByLogin(dto.login)
        const passwordEquals = await bcrypt.compare(dto.password, user.password)
        if (user && passwordEquals)
            return user;
        throw new UnauthorizedException({message: 'Incorrect login or password'})
    }

    async generateAndSaveTokens(user) {
        const tokens = await this.generateTokens(user)
        await this.userService.setRefreshToken(user.id, tokens.refreshToken)
        const {password, ...userData} = user
        return {
            ...tokens,
            user: {
                id: userData.dataValues.id,
                login: userData.dataValues.login,
                easyGamesWonCount: userData.dataValues.easyGamesWonCount,
                mediumGamesWonCount: userData.dataValues.mediumGamesWonCount,
                hardGamesWonCount: userData.dataValues.hardGamesWonCount
            }
        }
    }

    async logout(refreshToken: string) {
        return this.userService.clearRefreshToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Unauthorized')
        }
        try {
            const userData = this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_KEY})
            const user = await this.userService.confirmToken(userData.id, refreshToken)
            return this.generateAndSaveTokens(user)
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}
