import { Document, Schema, model } from 'mongoose'
import { ObjectId } from 'mongoose';
import { Reservation } from './reservation.model';
import { User } from './user.model';


export class Terrain {

    _id?: Schema.Types.ObjectId;
    title?: string;
    description?: string;
    price?: number;
    capacity?: number;
    region?: string;
    city?: string;
    favorite?: boolean;
    position?: {
        lat: number;
        lng: number;
    };
    owner?: User;
    reservation?: Reservation[];
    // acceptedReservation: number;
    // refusedReservation: number;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

const terrainSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    // acceptedReservation: {
    //     type: Number,
    //     default: 0
    // },
    // refusedReservation: {
    //     type: Number,
    //     default: 0
    // },
    position: {
        lat: Number,
        lng: Number,
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reservation: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }]
}, { timestamps: true })


export interface ITerrain extends Terrain, Document { _id?: ObjectId }
export const Terrains = model<ITerrain>('Terrain', terrainSchema)