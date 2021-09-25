import { validationResult } from "express-validator";
import { userRessource } from "../ressources/user.ressource";
import { reservationService } from "../services/reservation.service";
import { statService } from "../services/stat.service";
import { terrainService } from "../services/terrain.service";
import { userService } from "../services/user.service";
import { validationErrorResponse, successResponse, unauthorizedResponse } from "../utils/response.utils";

export const usersController = {
    getUsers: (req, res, next) => {
        const { page, limit, filter } = req.body
        userService.getUsers(limit, page, filter)
            .then((response) => {
                return successResponse(res, {
                    users: {
                        data: response[0].map((user) => userRessource.admin(user)),
                        total: response[1]
                    },
                    code: 1,
                    msg: 'users list'
                });
            })
            .catch((err) => {
                next(err);
            })
    },
    deleteUser: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        // repeated code find a way out
        userService.deleteUser({ _id: req.query.id })
            .then(async (user) => {
                if (!user) {
                    return unauthorizedResponse(res);
                }
                else {
                    statService.addDeletedAccount()
                        .catch((err) => next(err));

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
    updateUser: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        userService.updateUser({ _id: req.body.id }, req.body.user)
            .then((user) => {
                if (!user) {
                    return successResponse(res, { code: -1, msg: 'user not found' });
                }
                else {
                    return successResponse(res, { code: 1, msg: 'user updated' });
                }
            })
            .catch((err) => {
                next(err);
            })
    },
    getGovUserStats: (req, res, next) => {
        userService.getStats(req.body.filter)
            .then((response) => {

                return successResponse(res, {
                    region_total_users_stat: (response[1] * 100 / response[0] !== 0 ? (response[1] * 100 / response[0]).toFixed(2) : response[1] * 100 / response[0]) + '%',
                    region_total_users: response[1],
                    code: 1,
                    msg: 'users info'
                });
            })
            .catch((err) => {
                next(err);
            })
    },
    getGovTerrainStats: (req, res, next) => {
        terrainService.getTerrainStats(req.body.filter)
            .then((response) => {
                return successResponse(res, {
                    region_total_terrains_stat: (response[1] * 100 / response[0] !== 0 ? (response[1] * 100 / response[0]).toFixed(2) : response[1] * 100 / response[0]) + '%',
                    region_total_terrains: response[1],
                    code: 1,
                    msg: 'users info'
                });
            })
            .catch((err) => {
                next(err);
            })
    },
    getTotalStat: (req, res, next) => {
        statService.getStat()
            .then((response) => {
                return successResponse(res, {
                    deletedAccount: response.deletedAccount,
                    reservation: response.reservation,
                    code: 1,
                    msg: 'statistique'
                });
            })
            .catch((err) => {
                next(err);
            })
    },



    // To create stat in database
    // addStat: (req, res, next) => {
    //     statService.addStat()
    //         .then((response) => {
    //             return successResponse(res, {
    //                 code: 1,
    //                 msg: 'stat created'
    //             });
    //         })
    //         .catch((err) => {
    //             next(err);
    //         })
    // }
}