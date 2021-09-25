import { ITerrain, Terrain, Terrains } from "../models/terrain.model"

export const terrainService = {

    addTerrain: (data: Terrain): Promise<ITerrain> => {
        return new Promise<ITerrain>(async (resolve, reject) => {
            await Terrains.create(data).then((terrain: ITerrain) => {
                resolve(terrain)
            }).catch((err) => reject(err))
        });
    },

    deleteTerrain: (filter: object): Promise<ITerrain> => {
        return new Promise<ITerrain>(async (resolve, reject) => {
            await Terrains.findOneAndDelete(filter)
                .populate('reservation')
                .then((terrain) => resolve(terrain))
                .catch((err) => reject(err))
        });
    },
    getSingleTerrain: (filter: object): Promise<ITerrain> => {
        return new Promise<ITerrain>(async (resolve, reject) => {
            await Terrains.findOne(filter)
                .populate("owner")
                .populate("reservation")
                .then((terrain) => {
                    resolve(terrain)
                })
                .catch((err) => reject(err))
        });
    },

    getTerrain: (limit: number, page: number, filter: any = {}): Promise<[ITerrain[], number]> => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const result = await Promise.all([
                    Terrains.find(filter).limit(Number(limit)).skip((page - 1) * limit).sort({ 'updatedAt': 'desc' }).exec()
                    , // The lean option tells Mongoose to skip hydrating the result documents.
                    Terrains.countDocuments(filter)
                ]);
                resolve(result)
            }
            catch (err) {
                reject(err);
            }
        });
    },
    updateTerrain: (filter, update, option = { new: false }): Promise<ITerrain> => {
        return new Promise<ITerrain>(async (resolve, reject) => {
            await Terrains.findOneAndUpdate(filter, update, option)
                .then((terrain) => resolve(terrain))
                .catch((err) => reject(err))
        });
    },
    getAll: (filter: any = {}): Promise<[ITerrain[], number]> => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const result = await Promise.all([
                    Terrains.find(filter).sort({ 'updatedAt': 'desc' }).exec()
                    , // The lean option tells Mongoose to skip hydrating the result documents.
                    Terrains.countDocuments(filter)
                ]);
                resolve(result)
            }
            catch (err) {
                reject(err);
            }
        });
    },
    getTerrainStats: (filter): Promise<[number, number]> => {
        return new Promise<[number, number]>(async (resolve, reject) => {
            Promise.all([
                Terrains.countDocuments(),
                Terrains.countDocuments(filter)
            ])
                .then((nbrterrain: [number, number]) => resolve(nbrterrain))
                .catch((err) => reject(err))
        });
    },
}