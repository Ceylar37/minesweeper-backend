import {Body, Controller, Get, Post, Request, Response, UseGuards} from '@nestjs/common';
import {CreateGameDto} from "./dto/create-game.dto";
import {GameService} from "./game.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('game')
export class GameController {

    constructor(private gameService: GameService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createGame(@Body() dto: CreateGameDto, @Request() req, @Response() res) {
        const {authorization} = req.headers
        const {updatedAt, createdAt, ...resData} = await this.gameService.createGame(dto, authorization)
        return res.json(resData)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getLeadersList() {
        return this.gameService.getLeaderList()
    }
}
