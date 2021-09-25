import { userService } from "../services/user.service"
import { IUser } from '../models/user.model';
import { successResponse, unauthorizedResponse, validationErrorResponse } from "../utils/response.utils";
import { userRessource } from "../ressources/user.ressource";
import { validationResult } from "express-validator";
import * as bcrypt from "bcryptjs";
import { terrainService } from "../services/terrain.service";
import { reservationService } from "../services/reservation.service";
import { statService } from "../services/stat.service";

export const userController = {
    getCurrentUser: (req, res, next) => {
        userService.getUser({ _id: req.currentUser._id })
            .then((user: IUser) => {
                if (!user) {
                    return unauthorizedResponse(res);
                } else {
                    return successResponse(res, { user: userRessource.profile(user), code: 1 });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    updateCurrentUser: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }

        userService.updateUser({ _id: req.currentUser._id }, req.body.user)
            .then(async (user: IUser) => {
                if (!user) {
                    return unauthorizedResponse(res);
                } else {
                    if (req.body.password && req.body.currentPassword) {

                        if (! await bcrypt.compare(req.body.currentPassword, user.password)) {
                            return successResponse(res, { code: -1, msg: 'password invalid' })
                        } else {
                            user.password = req.body.password;
                            await user.save()
                        }
                    }
                    return successResponse(res, { code: 1, msg: 'user updated' });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // proprietaireGetStats: (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }

    //     userService.updateUser({ _id: req.currentUser._id }, req.body.user)
    //         .then(async (user: IUser) => {
    //             if (!user) {
    //                 return unauthorizedResponse(res);
    //             } else {
    //                 if (req.body.password && req.body.currentPassword) {

    //                     if (! await bcrypt.compare(req.body.currentPassword, user.password)) {
    //                         return successResponse(res, { code: -1, msg: 'password invalid' })
    //                     } else {
    //                         user.password = req.body.password;
    //                         await user.save()
    //                     }
    //                 }
    //                 return successResponse(res, { code: 1, msg: 'user updated' });
    //             }
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // },
    deleteUser: (req, res, next) => {

        userService.deleteUser({ _id: req.currentUser._id })
            .then(async (user) => {
                if (!user) {
                    return unauthorizedResponse(res);
                }
                else {
                    statService.addDeletedAccount()
                        .catch(err => next(err))
                    user.terrain.forEach(async (terrain) => {
                        await terrainService.deleteTerrain({ _id: terrain._id })
                            .then((terrainDeleted) => {
                                if (terrainDeleted.reservation.length > 0) {
                                    terrainDeleted.reservation.forEach(async (reservation) => {
                                        await reservationService.deleteReservation({ _id: reservation._id })
                                            .then(async reserv => {
                                                userService.updateUser({ _id: reserv.client._id }, { $pull: { reservation: { $in: [reservation._id] } } })
                                                    .catch((err) => next(err))

                                            })
                                    })
                                }
                            })
                    })
                    if (user.reservation.length > 0) {
                        user.reservation.forEach(async (id) => {
                            await reservationService.deleteReservation({ _id: id })
                                .catch((err) => next(err))
                        })

                    }

                    return successResponse(res, { code: 1, msg: 'user deleted' });
                }
            })
            .catch((err) => {
                next(err);
            })
    },
}