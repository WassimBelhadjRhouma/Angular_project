import { IUser, User, Users } from "../models/user.model"

export const userService = {
    getUser: (filter: object): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await Users.findOne(filter)
                .populate('terrain')
                .populate('reservation')
                .populate('favorite')
                .then((user: IUser) => {
                    resolve(user)
                })
                .catch((err) => reject(err))
        });
    },
    getUsers: (limit: number, page: number, filter: object = {}): Promise<[IUser[], number]> => {
        return new Promise<[IUser[], number]>(async (resolve, reject) => {
            Promise.all([
                Users.find(filter).limit(Number(limit)).skip((page - 1) * limit).sort({ 'updatedAt': 'desc' }).exec(), // The lean option tells Mongoose to skip hydrating the result documents.
                Users.countDocuments(filter)
            ])
                .then((suc: [IUser[], number]) => {
                    resolve(suc);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    },
    addUser: (data: User): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await Users.create(data).then((user: IUser) => {
                resolve(user)
            }).catch((err) => reject(err))
        });
    },
    updateUser: (filter, update, option = { new: false }): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await Users.findOneAndUpdate(filter, update, option)
                .then((user) => resolve(user))
                .catch((err) => reject(err))
        });
    },
    deleteUser: (filter: object): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await Users.findOneAndDelete(filter)
                .populate('reservation')
                .populate('terrain')
                .then((user) => resolve(user))
                .catch((err) => reject(err))
        });
    },
    getStats: (filter: object = {}): Promise<[number, number]> => {
        return new Promise<[number, number]>(async (resolve, reject) => {
            Promise.all([
                Users.countDocuments(),
                Users.countDocuments(filter)
            ])
                .then((suc: [number, number]) => {
                    console.log(suc)
                    resolve(suc);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    },

}