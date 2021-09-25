import { IverifedToken, User } from "../models/user.model"
import { successResponse, validationErrorResponse } from '../utils/response.utils';
import { Request, Response, NextFunction } from 'express'
import { validationResult } from "express-validator";
import { userService } from "../services/user.service";
import { mailer } from "./../utils/mailer";
import { userRessource } from "../ressources/user.ressource";

export const authController = {
    emailSignup: async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        userService.getUser({ email: req.body.email })
            .then((user) => {
                if (user) {
                    return successResponse(res, { code: -1, msg: 'email already exist' });
                }
                else {
                    const newUser: User = new User(req.body);
                    newUser.email = newUser.email.toLowerCase().trim();
                    newUser.codeValidation = User.generateCode(req.body.email);
                    userService.addUser(newUser)
                        .then(() => {
                            mailer.welcomeEmail(newUser.email, newUser.codeValidation);
                            return successResponse(res, { code: 1, msg: 'user created' });
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            })
            .catch((err) => {
                next(err);
            });
    },

    signin: async (req, res, next) => {
        const user = req.currentUser;
        if (user.isBlocked) {
            return successResponse(res, { code: -2, msg: 'blocked user' });
        } else if (!user.emailConfirmed) {
            return successResponse(res, { code: -1, msg: 'please confirm your email' });
        } else if (!user.password || !user.region || !user.city) {
            return successResponse(res, { code: 2, msg: 'please update your profile', user: userRessource.profile(user), "token": user.generateJwt() });
        } else {
            return successResponse(res, { code: 1, user: userRessource.profile(user), "token": user.generateJwt() });
        }
    },

    emailConfirmation: (req: any, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }

        const tokenStatus: IverifedToken = User.checkGeneratedCode(req.query.emailCode)

        if (tokenStatus.status === 'invalid') {
            return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
        } else if (tokenStatus.status === 'expired') { // resend

            const codeValidation = User.generateCode(tokenStatus.email);
            userService.updateUser({ email: tokenStatus.email, emailConfirmed: false, codeValidation: req.query.emailCode }, { codeValidation })
                .then((user) => {
                    if (!user) {
                        return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
                    } else {
                        mailer.welcomeEmail(tokenStatus.email, codeValidation);
                        return successResponse(res, { code: -2, msg: 'expired confirmation code resend done' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        } else {
            userService.getUser({ email: tokenStatus.email })
                .then((user) => {
                    if (user.emailConfirmed === true) {
                        return successResponse(res, { code: 1, msg: 'email confirmed' });
                    }
                })
                .catch((err) => {
                    next(err);
                })

            userService.updateUser({ email: tokenStatus.email, emailConfirmed: false, codeValidation: req.query.emailCode }, { emailConfirmed: true, $unset: { codeValidation: "" } })
                .then((user) => {
                    if (!user) {
                        return validationErrorResponse(res, { code: -1, msg: 'invalid confirmation code' });
                    } else {
                        return successResponse(res, { code: 1, msg: 'email confirmed' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }

    },

    askResetPassword: (req: any, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const codeValidation = User.generateCode(req.body.email);
        userService.updateUser({ email: req.body.email }, { codeValidation })
            .then((user) => {
                if (!user) {
                    return successResponse(res, { code: -1, msg: 'bad credential' });
                } else {
                    mailer.resetPassword(req.body.email, codeValidation);
                    return successResponse(res, { code: 1, msg: 'reset password mail sent' });
                }
            })
            .catch((err) => {
                next(err);
            });
    },


    checkToken: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const tokenStatus: IverifedToken = User.checkGeneratedCode(req.query.emailCode)
        if (tokenStatus.status === 'invalid') {
            return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
        }
        if (tokenStatus.status === 'expired') {
            return successResponse(res, { code: -2, msg: 'expired confirmation code' });
        } else {
            userService.getUser({ email: tokenStatus.email, codeValidation: req.query.emailCode })
                .then((user) => {
                    if (!user) {
                        return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
                    } else {
                        return successResponse(res, { code: 1, msg: 'valid confirmation code' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }
    },


    resetPassword: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const tokenStatus: IverifedToken = User.checkGeneratedCode(req.body.emailCode)

        if (tokenStatus.status === 'invalid') {
            return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
        } else if (tokenStatus.status === 'expired') {
            return successResponse(res, { code: -2, msg: 'expired confirmation code' });
        } else {
            userService.updateUser({ email: tokenStatus.email, codeValidation: req.body.emailCode }, { emailConfirmed: true, password: User.cryptPassword(req.body.password), $unset: { codeValidation: "" } })
                .then((user) => {
                    if (!user) {
                        return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
                    } else {
                        return successResponse(res, { code: 1, user: userRessource.profile(user), msg: 'password modified' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }
    }
}