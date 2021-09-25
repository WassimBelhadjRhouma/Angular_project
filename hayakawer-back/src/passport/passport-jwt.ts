import { ExtractJwt, Strategy } from 'passport-jwt';
import { userService } from "../services/user.service";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

export const jwtProtect = new Strategy(jwtOptions, (payload, done) => {
    userService.getUser({ _id: payload.id })
        .then((user) => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'user dosent exist' } );
            }
        }).catch(err => done(err, false))
});

