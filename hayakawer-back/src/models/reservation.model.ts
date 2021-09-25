import { Document, Schema, model } from 'mongoose'
import { ObjectId } from 'mongoose';
import { Terrain } from './terrain.model';
import { User } from './user.model';


export class Reservation {
    _id?: Schema.Types.ObjectId;
    startAt?: Date;
    endAt?: Date;
    terrain?: Terrain;
    client?: User;
    confirmed?: boolean;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

const reservationSchema = new Schema({
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },
    terrain: {
        type: Schema.Types.ObjectId,
        ref: 'Terrain'
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


export interface IReservation extends Reservation, Document { _id?: ObjectId }
export const Reservations = model<IReservation>('Reservation', reservationSchema)
