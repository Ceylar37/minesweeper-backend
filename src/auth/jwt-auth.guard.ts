import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization
            const [bearer, token] = authHeader.split(' ')

            if (bearer !== 'Bearer' || !token)
                throw new  UnauthorizedException({message: 'Unauthorized'})

            req.user = this.jwtService.verify(token, {secret: process.env.ACCESS_KEY})
            return true

        } catch (e) {
            throw new  UnauthorizedException({message: 'Unauthorized'})
        }
    }
}