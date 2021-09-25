import { check } from 'express-validator';
import * as mongoose from 'mongoose';
export const reservationValidation = {
    addReservation: [
        check('startAt').exists().withMessage({ msg: 'startAt required' }),
        check('endAt').exists().withMessage({ msg: 'endAt required' }),
        check('terrain').exists().withMessage({ msg: 'terrain id required' })
            .custom((terrain) => {
                return mongoose.Types.ObjectId.isValid(terrain)
            })
            .withMessage({ msg: 'invalid terrain id' })
    ],
    refuseReservation: [
        check('reservation_id').exists().withMessage({ msg: 'reservation id required' })
            .custom((reservation) => {
                return mongoose.Types.ObjectId.isValid(reservation)
            })
            .withMessage({ msg: 'invalid reservation id' })
    ],
    acceptReservation: [
        check('reservation_id').exists().withMessage({ msg: 'reservation id required' })
            .custom((reservation) => {
                return mongoose.Types.ObjectId.isValid(reservation)
            })
            .withMessage({ msg: 'invalid reservation id' })
    ],
};
