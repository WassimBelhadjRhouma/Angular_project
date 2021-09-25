import { successResponse, unauthorizedResponse, validationErrorResponse } from "../utils/response.utils";
import { validationResult } from "express-validator";
import { terrainService } from "../services/terrain.service";
import { ITerrain, Terrain } from "../models/terrain.model";
import { terrainRessource } from "../ressources/terrain.ressource";
import { userService } from "../services/user.service";

export const terrainController = {

    addTerrain: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const newTerrain: Terrain = new Terrain(req.body);
        newTerrain.owner = req.currentUser._id
        newTerrain.favorite = false
        terrainService.addTerrain(newTerrain)
            .then((terrainCreated) => {
                if (!terrainCreated) {
                    return successResponse(res, { code: -1, msg: 'terrain not created', });
                }
                userService.updateUser({ _id: req.currentUser._id }, { $push: { terrain: terrainCreated._id } })
                    .then((user) => {
                        if (!user) {
                            return unauthorizedResponse(res);
                        }
                        return successResponse(res, { code: 1, msg: 'terrain created' });
                    })
                    .catch((err) => {
                        next(err)
                    });
            })
            .catch((err) => {
                console.log('here 2');
                next(err);
            });


    },

    updateTerrain: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { terrain_id, terrain } = req.body;

        terrainService.updateTerrain({ _id: terrain_id }, terrain)
            .then((terrain: ITerrain) => {
                if (!terrain) {
                    return unauthorizedResponse(res);
                } else {
                    return successResponse(res, { code: 1, msg: 'terrain updated' });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    deleteTerrain: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        terrainService.deleteTerrain({ _id: req.query.terrain })
            .then((terrainDeleted) => {
                if (!terrainDeleted) {
                    return successResponse(res, { code: -1, msg: "terrain not deleted" });
                } else {
                    userService.updateUser({ _id: req.currentUser._id }, { $pull: { terrain: terrainDeleted._id } })
                        .then((user) => {
                            if (!user) {
                                return unauthorizedResponse(res);
                            }
                            return successResponse(res, { code: 1, msg: 'terrain deleted' });
                        })
                        .catch((err) => {
                            next(err)
                        });
                }
            })
            .catch((err) => {
                next(err);
            })
    },

    getTerrains: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { page, limit, filter } = req.body
        terrainService.getTerrain(limit, page, filter)
            .then((response) => {
                return successResponse(res, {
                    terrains: response[0].map((terrain) => terrainRessource.getTerrain(terrain)),
                    total: response[1],
                    code: 1,
                    msg: 'terrains list'
                });
            })
            .catch((err) => {
                next(err);
            });
    },

    getOwnerTerrains: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { page, limit, filter } = req.body
        if (filter) {
            filter.owner = req.currentUser._id
        }
        terrainService.getTerrain(limit, page, filter)
            .then((response) => {
                return successResponse(res, {
                    terrains: response[0].map((terrain) => terrainRessource.getTerrain(terrain)),
                    total: response[1],
                    code: 1,
                    msg: 'terrains list'
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    getSingleTerrain: (req, res, next) => {

        const { id } = req.query

        terrainService.getSingleTerrain({ _id: id })
            .then((terrain) => {
                if (!terrain) {
                    return successResponse(res, { code: -1, msg: 'terrain not found' })
                }
                return successResponse(res, {
                    terrain,
                    code: 1,
                    msg: 'terrain found'
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    addFavorite: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { terrain_id } = req.body;

        userService.updateUser({ _id: req.currentUser._id }, { $push: { favorite: terrain_id } })
            .then((user) => {
                if (!user) {
                    return unauthorizedResponse(res);
                } else {
                    return successResponse(res, { code: 1, msg: 'terrain added to favorite' });
                }
            })
            .catch((err) => {
                next(err)
            });
    },
    removeFavorite: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { terrain_id } = req.query;

        userService.updateUser({ _id: req.currentUser._id }, { $pull: { favorite: { $in: [terrain_id] } } })
            .then((user) => {
                if (!user) {
                    return unauthorizedResponse(res);
                } else {
                    return successResponse(res, { code: 1, msg: 'terrain Deleted from favorite' });
                }
            })
            .catch((err) => {
                next(err)
            });
    },
    getAll: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { filter } = req.body;

        terrainService.getAll(filter)
            .then((data) => {
                if (!data) {
                    return unauthorizedResponse(res);
                } else {

                    let terrains = data[0].map((terrain) => {
                        return {
                            _id: terrain._id,
                            position: terrain.position,
                            price: terrain.price,
                            capacity: terrain.capacity,
                            region: terrain.region,
                            city: terrain.city,
                            owner: terrain.owner,
                            title: terrain.title,
                            description: terrain.description,
                            reservation: terrain.reservation,
                            favorite: req.currentUser.favorite.includes(terrain._id) ? true : false,
                        }
                    })

                    return successResponse(res, { code: 1, msg: 'terrain detailed list', terrains, total: data[1] });
                }
            })
            .catch((err) => {
                next(err)
            });
    },
    getFavorite: async (req, res, next) => {
        userService.getUser({ _id: req.currentUser._id })
            .then((user) => {
                if (!user) {
                    return unauthorizedResponse(res);
                }
                return successResponse(res, { code: 1, msg: "favorite list", favorite: user.favorite })
            })
            .catch((err) => next(err))
    },
}