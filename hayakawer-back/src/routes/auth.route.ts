import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { authValidation } from '../validation/auth.validation';
import * as passport from 'passport';
import { localLogin } from '../passport/passport.local';
import { fbLogin } from '../passport/passport-facebook';
import { googleLogin } from '../passport/passport.google';
import { passportMiddleware } from '../middlewares/passport.middleware';
import { jwtProtect } from '../passport/passport-jwt';

passport.use(localLogin);
passport.use(googleLogin);
passport.use(fbLogin);
passport.use(jwtProtect);

const authRoute = Router();

authRoute.post('/signup', authValidation.signup, authController.emailSignup);

authRoute.post('/signin', passportMiddleware.passportSignIn, authController.signin);

authRoute.post('/signin/fb', passportMiddleware.passportSignInFacebook, authController.signin);

authRoute.post('/signin/google', passportMiddleware.passportSignInGoogle, authController.signin);

authRoute.get('/confirm-email', authValidation.emailConfirmation, authController.emailConfirmation);

authRoute.post('/ask-reset-password', authValidation.askResetPassword, authController.askResetPassword);

authRoute.get('/check-token', authValidation.checkToken, authController.checkToken);

authRoute.post('/reset-password', authValidation.resetPassword, authController.resetPassword);


export default authRoute;
