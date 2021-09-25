import { check } from 'express-validator';
import * as mongoose from 'mongoose';
export const usersValidation = {
    getUsers: [
        check('filter').optional().isObject().withMessage({ msg: "filter invalid" })
            .customSanitizer((filter) => {
                const newFilter: any = {};
                const userAttributes = ["firstName", "createdAt", "userType", "lastName", "email", "emailConfirmed", "isBlocked", "region", "city", "$nor", "$or"]
                for (const key of Object.keys(filter)) {
                    if (userAttributes.includes(key)) {
                        newFilter[key] = filter[key];
                    }
                }
                return newFilter;
            })
            .custom((filter) => {
                if (Object.keys(filter).length === 0) {
                    return false;
                }
                return true;
            }).withMessage({ msg: 'filter invalid' })
    ],
    deleteUser: [
        check('id').exists().withMessage({ msg: 'id required' }),
    ],
    updateUser: [
        check('id').exists().withMessage({ msg: 'id required' })
            .custom((id) => {
                return mongoose.Types.ObjectId.isValid(id)
            })
            .withMessage({ msg: 'valid id required' }),
        check('user').exists().withMessage({ msg: 'user required' })
            .customSanitizer((filter) => {
                const updaterUser: any = {}
                const userAttributes = ["firstName", "lastName", "email", "emailConfirmed", "isBlocked", "region", "city"]
                for (const key of Object.keys(filter)) {
                    if (userAttributes.includes(key)) {
                        updaterUser[key] = filter[key];
                    }
                }
                return updaterUser;
            })
            .custom((filter) => {
                if (Object.keys(filter).length === 0) {
                    return false;
                }
                return true;
            }).withMessage({ msg: 'filter invalid' })
    ],
};
