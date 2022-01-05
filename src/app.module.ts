import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {UserModel} from "./models/user.model";
import {GameModel} from "./models/game.model";
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            models: [UserModel, GameModel],
            autoLoadModels: true
        }),
        UserModule,
        GameModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
