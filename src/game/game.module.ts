import {Module} from '@nestjs/common';
import {GameController} from './game.controller';
import {GameService} from './game.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {GameModel} from "../models/game.model";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
      SequelizeModule.forFeature([GameModel]),
      UserModule
  ],
})
export class GameModule {}
