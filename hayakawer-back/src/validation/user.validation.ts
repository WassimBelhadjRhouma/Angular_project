import { check } from 'express-validator';

export const userValidation = {
    updateUser: [
        check('user').optional()
            .customSanitizer((filter) => {
                const updaterUser: any = {}
                const userAttributes = ["firstName", "lastName", "region", "city", "userType"]
                for (const key of Object.keys(filter)) {
                    if (userAttributes.includes(key)) {
                        updaterUser[key] = filter[key];
                    }
                }
                return updaterUser
            })
            .custom((filter) => {
                if (Object.keys(filter).length === 0) {
                    return false;
                }
                return true;
            }).withMessage({ msg: 'filter invalid' })
        ,
        check('currentPassword').optional().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/, "i").withMessage({ msg: 'Invalid Password (should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number)' }),
        check('password').optional().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/, "i").withMessage({ msg: 'Invalid Password (should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number)' }),
    ]
};
