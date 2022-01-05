import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "../models/user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {

    constructor(@InjectModel (UserModel) private userRepository: typeof UserModel, private jwtService: JwtService) {
    }

    async getUserById(query: {userId: number}) {
        return await this.userRepository.findOne({where: {id: Number(query.userId)}, attributes: ['id', 'login', 'easyGamesWonCount', 'mediumGamesWonCount', 'hardGamesWonCount']})
    }

    async createUser(dto: CreateUserDto) {
        return await this.userRepository.create(dto)
    }

    async getUserByLogin(login: string) {
        return await this.userRepository.findOne({where: {login}, attributes: ['id', 'login', 'password', 'easyGamesWonCount', 'mediumGamesWonCount', 'hardGamesWonCount']})
    }

    async setRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findByPk(userId)
        if (user) {
            user.token = refreshToken
            return user.save()
        }
    }

    async clearRefreshToken(token: string) {
        const user = await this.userRepository.findOne({where: {token}})
        if (user) {
            user.token = ''
            return user.save()
        }
    }

    async confirmToken(id: number, refreshToken: string) {
        const user = await this.userRepository.findByPk(id)
        if (user.token !== refreshToken) {
            throw new Error
        }
        return user
    }

    async getMe(authorization) {
        const token = authorization.split(' ')[1]
        if (token) {
            return await this.jwtService.verify(token, {secret: process.env.ACCESS_KEY})
        }
    }
}