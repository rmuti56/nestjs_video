import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github";
import 'dotenv/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github')
{

  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENTID,     // <- Replace this with your client id
      clientSecret: process.env.GITHUB_CLIENTSECRET, // <- Replace this with your client secret
      callbackURL: "http://localhost:5000/auth/github/callback",
      passReqToCallback: true,
      scope: ['profile']
    })
  }


  async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
    console.log(accessToken)
    try {
      console.log(profile);

      const jwt: string = 'placeholderJWT'
      const user =
      {
        jwt
      }

      done(null, user);
    }
    catch (err) {
      // console.log(err)
      done(err, false);
    }
  }

}