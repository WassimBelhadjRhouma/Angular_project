import { IStrategyOptions, Strategy } from 'passport-local';
import { userService } from "../services/user.service";

const localOptions: IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
};

export const localLogin = new Strategy(localOptions, (email, password, done) => {
    console.log(email)
    console.log(password)

    userService.getUser({ email: email.toLowerCase() })
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'bad credential' });
            } else {
                user.comparePassword(password, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isMatch) {
                        return done(null, false, { message: 'bad credential' });
                    }
                    return done(null, user);
                });
            }
        })
        .catch((err) => {
            done(err);
        });
});