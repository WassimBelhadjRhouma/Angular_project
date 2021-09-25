import { Strategy as GoogleTokenStrategy } from 'passport-google-token'
import { IUser, User } from '../models/user.model';
import { userService } from '../services/user.service';



export const googleOptions = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET
};

export const googleLogin = new GoogleTokenStrategy(googleOptions, (accessToken, refreshToken, profile, done) => {
    if (!profile?.displayName) {
        return done(null, false, { message: 'missing google permission' });
    } else {
        userService.getUser({ email: profile._json.email.toLowerCase().trim() })
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    if (!profile._json.given_name || !profile._json.family_name) {
                        return done(null, false, { message: 'missing google permission' });
                    } else {
                        const newUser: User = new User({});
                        newUser.lastName = profile._json.family_name.toLowerCase().trim();
                        newUser.firstName = profile._json.given_name.toLowerCase().trim();
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