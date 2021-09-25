import { check } from 'express-validator';

export const authValidation = {
    signup: [
        check('password').exists().withMessage({ msg: 'password required' })
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/, "i").withMessage({ msg: 'password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number' }),
        check('email').exists().withMessage({ msg: 'email required' }).isEmail().withMessage({ msg: 'email invalid' }),
        check('firstName').exists().withMessage({ msg: 'first name required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid firstname' }),
        check('lastName').exists().withMessage({ msg: 'last name required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid lastName' }),
        check('region').exists().withMessage({ msg: 'Region required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid region' }),
        check('city').exists().withMessage({ msg: 'city required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid city' }),
    ],
    emailConfirmation: [
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ],
    askResetPassword: [
        check('email').exists().withMessage({ msg: 'email required' })
            .isEmail().withMessage({ msg: 'email invalid' }),
    ],
    checkToken: [
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ],
    resetPassword: [
        check('password').exists().withMessage({ msg: 'password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number' })
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/, "i").withMessage({ msg: 'password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number' }),
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ]
};
