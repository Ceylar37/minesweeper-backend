import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from "../models/user.model";
import {AuthModule} from "../auth/auth.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([UserModel]),
        JwtModule.register({
        })
    ],
    exports: [
        UserService,
        JwtModule
    ]
})
export class UserModule {
}
