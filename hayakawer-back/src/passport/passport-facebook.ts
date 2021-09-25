import { StrategyOptions } from 'passport-facebook-token';
import PassportFacebookToken = require('passport-facebook-token');
import { IUser, User } from '../models/user.model';
import { userService } from '../services/user.service';


export const fbOptions: StrategyOptions = {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'name', 'email']
};


export const fbLogin = new PassportFacebookToken(fbOptions, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    if (!profile?._json.email) {
        return done(null, false, { message: 'missing facebook permission' });
    } else {
        userService.getUser({ email: profile._json.email.toLowerCase().trim() })
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    if (!profile._json.last_name || !profile._json.first_name) {
                        return done(null, false, { message: 'missing facebook permission' });
                    } else {
                        const newUser: User = new User({});
                        newUser.lastName = profile._json.last_name.toLowerCase().trim();
                        newUser.firstName = profile._json.first_name.toLowerCase().trim();
                        newUser.email = profile._json.email.toLowerCase().trim();
                        newUser.emailConfirmed = true;
                        userService.addUser(newUser)
                            .then((adeddUser: IUser) => {
                                return done(null, adeddUser);
                            })
                            .catch((err) => {
                                return done(err);
                            });
                    }
                }
            })
            .catch((err) => {
                return done(err);
            });
    }
});