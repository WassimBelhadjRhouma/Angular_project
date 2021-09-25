import { successResponse, unauthorizedResponse, validationErrorResponse } from "../utils/response.utils";
import { validationResult } from "express-validator";
import { terrainService } from "../services/terrain.service";
import { Terrain } from "../models/terrain.model";
import { userService } from "../services/user.service";
import { User } from "../models/user.model";
import { reservationService } from "../services/reservation.service";
import { IReservation } from "../models/reservation.model";
import { reservationRessource } from "../ressources/reservation.ressource";
import { statService } from "../services/stat.service";


export const reservationController = {
    getReservation: (req, res, next) => {
        const terrain = req.query.terrain;

        if (!terrain) {
            return successResponse(res, { msg: 'terrain id required' });
        }
        // mongoose.Types.ObjectId(terrain)
        reservationService.getManyReservations({ terrain })
            .then((reservation) => {
                if (!reservation) {
                    return successResponse(res, { code: -1, msg: 'reservation not found' });
                } else {
                    return successResponse(res, { reservation, code: 1 });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    addReservation: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const currentUser: User = req.currentUser;

        if (!currentUser) {
            return unauthorizedResponse(res);
        }


        let terrainToReserve: Terrain;
        const { startAt, endAt, terrain } = req.body;

        await terrainService.getSingleTerrain({ _id: terrain })
            .then((terrainFound) => {
                if (!terrainFound) {
                    return successResponse(res, { code: -1, msg: 'terrain not found', });
                }
                terrainToReserve = terrainFound;

            })
            .catch((err) => {
                next(err);
            });

        const selfReservation = JSON.stringify(currentUser._id) === JSON.stringify(terrainToReserve.owner._id) ? true : false;

        const reservation = {
            terrain,
            endAt,
            startAt,
            client: currentUser._id,
            confirmed: selfReservation
        }
        await reservationService.addReservation(reservation)
            .then(async (reservationCreated) => {
                if (!reservationCreated) {
                    return successResponse(res, { code: -1, msg: 'fail to add reservation', });
                } else {

                    await terrainService.updateTerrain({ _id: reservationCreated.terrain }, { reservation: [...terrainToReserve.reservation, reservationCreated._id] })
                        .then(async (terrain) => {
                            if (!terrain) {
                                return successResponse(res, { code: -1, msg: 'fail to add reservation', });
                            }
                            if (selfReservation) {
                                return successResponse(res, { code: 1, msg: 'reservation successfully added', reservation: reservationRessource.reservation(reservationCreated) });
                            }
                            await userService.updateUser({ _id: currentUser._id }, { reservation: [...currentUser.reservation, reservationCreated._id] })
                                .then((user) => {
                                    if (!user) {
                                        return successResponse(res, { code: -1, msg: 'fail to add reservation', });
                                    }
                                    statService.addReservation()
                                        .catch(err => next(err))
                                    return successResponse(res, { code: 1, msg: 'reservation successfully added', reservation: reservationRessource.reservation(reservationCreated) });
                                })
                                .catch((err) => {
                                    next(err)
                                })
                        })
                        .catch((err) => {
                            next(err)
                        })
                }
            })
            .catch((err) => {
                next(err)
            })

    },

    refuseReservation: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const currentUser: User = req.currentUser;

        if (!currentUser) {
            return unauthorizedResponse(res);
        }

        const { reservation_id } = req.query;
        await reservationService.getReservation({ _id: reservation_id })
            .then(async (reservation) => {
                if (!reservation) {
                    return successResponse(res, { code: -2, msg: 'reservation not found', });
                }
                if (((JSON.stringify(reservation.client) !== JSON.stringify(currentUser._id) ? true : false) && (JSON.stringify(reservation.terrain.owner) !== JSON.stringify(currentUser._id) ? true : false))) {
                    return successResponse(res, { code: -1, msg: 'user not related to this reservation', });
                } else {
                    await reservationService.deleteReservation({ _id: reservation_id })
                        .then(async (reservationDeleted: IReservation) => {
                            if (!reservationDeleted) {
                                return successResponse(res, { code: -2, msg: 'reservation not found', });
                            }
                            // delete the reservation Id from the terrain and the client who sent the reservation:
                            // 1 terrain
                            const updatedTerrainReservation = reservationDeleted.terrain.reservation.filter((reserv) => {
                                return (JSON.stringify(reserv) === JSON.stringify(reservation_id) ? false : true)
                            })
                            // 2 client
                            const updatedClientReservation = reservationDeleted.client.reservation.filter((reserv) => {
                                return (JSON.stringify(reserv) === JSON.stringify(reservation_id) ? false : true)
                            })

                            await terrainService.updateTerrain({ _id: reservationDeleted.terrain._id }, { reservation: updatedTerrainReservation })
                                .then((terrain) => {
                                    if (!terrain) {
                                        return successResponse(res, { code: -3, msg: 'reservation not completely deleted', });
                                    }
                                })
                                .catch((err) => {
                                    next(err)
                                })
                            if (JSON.stringify(reservationDeleted.client) === JSON.stringify(currentUser._id) ? false : true) {
                                userService.updateUser({ _id: reservationDeleted.client._id }, { reservation: updatedClientReservation })
                                    .then((user) => {
                                        if (!user) {
                                            return successResponse(res, { code: -3, msg: 'reservation not completely deleted', });
                                        }
                                    })
                                    .catch((err) => {
                                        next(err);
                                    })
                                if ((new Date() < reservationDeleted.startAt)) {
                                    await terrainService.updateTerrain({ _id: reservationDeleted.terrain._id }, { $inc: { refusedReservation: 1 } })
                                        .catch((err) => next(err));
                                }
                            }
                            return successResponse(res, { code: 1, msg: 'reservation deleted' });
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            })
            .catch(err => {
                next(err)
            })


    },
    acceptReservation: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const currentUser: User = req.currentUser;

        if (!currentUser) {
            return unauthorizedResponse(res);
        }

        // let terrainToReserve: Terrain;
        const { reservation_id } = req.body;
        reservationService.getReservation({ _id: reservation_id })
            .then(async (reservation) => {
                if (!reservation) {
                    return successResponse(res, { code: -1, msg: 'reservation not found', });
                }
                if ((JSON.stringify(reservation.terrain.owner) !== JSON.stringify(currentUser._id) ? true : false)) {
                    return successResponse(res, { code: -2, msg: 'user not related to this reservation', });
                }
                // terrainService.updateTerrain({ _id: reservation.terrain._id }, { $inc: { acceptedReservation: 1 } })
                //     .catch((err) => next(err))
                await reservationService.updateReservation({ _id: reservation_id }, { confirmed: true })
                    .then(async (reservationUpdated: IReservation) => {
                        if (!reservationUpdated) {
                            return successResponse(res, { code: -1, msg: 'reservation not confirmed', });
                        }
                        return successResponse(res, { code: 1, msg: 'reservation confirmed' });
                    })
                    .catch((err) => {
                        next(err);
                    });
            })
    }
}