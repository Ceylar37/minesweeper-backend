import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {GameModel} from "../models/game.model";
import {CreateGameDto} from "./dto/create-game.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class GameService {
    constructor(@InjectModel(GameModel) private gameRepository: typeof GameModel,
                private userService: UserService) {
    }

    async createGame(dto: CreateGameDto, authorization: string) {
        try {
            const user = await this.userService.getMe(authorization)
            return this.gameRepository.create({userId: user.id, userLogin: user.login, time: dto.time, difficult: dto.difficult})
        } catch (e) {
            throw new UnauthorizedException('Unauthorized')
        }
    }

    async getLeaderList() {
        const easyGamesList = await this.gameRepository.findAll({order: [['time', 'ASC']], where: {difficult: 'easy'}, attributes: ['id', 'userId', 'time', 'userLogin']})
        const mediumGamesList = await this.gameRepository.findAll({order: [['time', 'ASC']], where: {difficult: 'medium'}, attributes: ['id', 'userId', 'time', 'userLogin']})
        const hardGamesList = await this.gameRepository.findAll({order: [['time', 'ASC']], where: {difficult: 'hard'}, attributes: ['id', 'userId', 'time', 'userLogin']})
        return {easyGamesList, mediumGamesList, hardGamesList}
    }
}
