import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';
import config from 'src/config';
import { PayloadToken } from '../models/token.model';
import { AuthService } from '../services/auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) ConfigService: ConfigType<typeof config>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.jwtSecret,
    });
  }
  async validate(payload: PayloadToken) {
    try {
      await this.authService.getUserLogById(payload.sub);
      return payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Usuario no autorizado');
    }
  }
}
