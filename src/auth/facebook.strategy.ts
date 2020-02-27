import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as facebookTokenStrategy from 'passport-facebook-token';
import { use } from 'passport'
@Injectable()
export class FacebookStrategy {
  constructor(

  ) {
    this.init();
  }

  init() {
    use(
      new facebookTokenStrategy({
        clientID: '624639358301802',
        clientSecret: 'c3d24884d517cb15917a8803c8e90c06',
      },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any
        ) => {
          console.log(profile, 1);
          const user = {};
          return done(null, profile);
        })
    )
  }
}