import { Document, Schema, model } from 'mongoose'
import { ObjectId } from 'mongoose';


export class Stat {
    _id?: Schema.Types.ObjectId;
    deletedAccount?: number;
    reservation?: number;
    name?: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

const statSchema = new Schema({
    deletedAccount: {
        type: Number,
        default: 0
    },
    reservation: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })


export interface IStat extends Stat, Document { _id?: ObjectId }
export const Statistics = model<IStat>('Stat', statSchema)
