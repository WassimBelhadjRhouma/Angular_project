
import { IStat, Statistics } from "../models/stats.model";

export const statService = {

    addDeletedAccount: (): Promise<IStat> => {
        return new Promise<IStat>(async (resolve, reject) => {
            await Statistics.findOneAndUpdate({ name: 'users' }, { $inc: { deletedAccount: 1 } })
                .then((stat) => {
                    resolve(stat)
                }).catch((err) => reject(err))
        });
    },
    addReservation: (): Promise<IStat> => {
        return new Promise<IStat>(async (resolve, reject) => {
            await Statistics.findOneAndUpdate({ name: 'users' }, { $inc: { reservation: 1 } })
                .then((stat) => {
                    resolve(stat)
                }).catch((err) => reject(err))
        });
    },
    getStat: (): Promise<IStat> => {
        return new Promise<IStat>(async (resolve, reject) => {
            await Statistics.findOne({ name: 'users' })
                .then((stat) => {
                    resolve(stat)
                }).catch((err) => reject(err))
        });
    },
    addStat: (): Promise<IStat> => {
        return new Promise<IStat>(async (resolve, reject) => {
            await Statistics.create({ deletedAccount: 0, reservation: 0, name: 'users' })
                .then((stat) => {
                    resolve(stat)
                }).catch((err) => reject(err))
        });
    },
}