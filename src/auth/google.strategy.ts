import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{

  constructor() {
    super({
      clientID: '514721993615-6o0m5m7ucv4mlnlopr9eao72ojbdphm0.apps.googleusercontent.com',     // <- Replace this with your client id
      clientSecret: 'nG-UqVuoZe0j4vHQus7jRVI6', // <- Replace this with your client secret
      callbackURL: 'http://localhost:5000/auth/google/callback',
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