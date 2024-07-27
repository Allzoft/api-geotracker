import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class UserContextService {
  private user: Users;

  setUser(user: Users) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
