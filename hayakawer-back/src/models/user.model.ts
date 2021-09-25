import { Document, Schema, model } from 'mongoose'
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';
import { Terrain } from './terrain.model';
import { Reservation } from './reservation.model';

export enum Role {
    admin = 'admin',
    proprietaire = 'proprietaire',
    client = 'client'
}



export class User {
    _id?: Schema.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    userType: Role;
    region?: string;
    city?: string;
    codeValidation?: string;
    emailConfirmed?: boolean;
    isBlocked?: boolean;
    terrain?: Terrain[];
    reservation?: Reservation[];
    favorite?: Terrain[];

    constructor(data: any) {
        Object.assign(this, data);
    }

    comparePassword(plainPassword: string, callback: any) {
        bcrypt.compare(plainPassword, this.password, (err: Error, isMatch: boolean) => {
            callback(err, isMatch);
        });
    }

    generateJwt(): string {
        return jwt.sign({ "id": this._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    }

    static generateCode(email: string): string {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() + 10000);
        const linkCode = timestamp + '-' + randomNum + '-' + Buffer.from(email).toString('hex');
        return linkCode;
    }

    static cryptPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    }

    static checkGeneratedCode(emailCode: string): IverifedToken {
        const verifArr = emailCode.split("-")
        if (verifArr.length !== 3) {
            return { status: 'invalid' };
        }

        if (isNaN(Number(verifArr[0]))) {
            return { status: 'invalid' };
        }
        if ((Math.floor((Number(verifArr[0]) - new Date().getTime()) / 1000 / 60) + 60 * 24) < 1) {
            return { status: 'expired' };
        }
        return { status: 'valid', email: Buffer.from(verifArr[2], 'hex').toString() };
    }
}

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    userType: {
        type: String,
        enum: Role,
        default: 'client'
    },
    region: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    codeValidation: {
        type: String,
        required: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    terrain: [{ type: Schema.Types.ObjectId, ref: 'Terrain' }],
    reservation: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    favorite: [{ type: Schema.Types.ObjectId, ref: 'Terrain' }],

}, { timestamps: true })

userSchema.method('comparePassword', User.prototype.comparePassword)
userSchema.method('generateJwt', User.prototype.generateJwt)


userSchema.pre<IUser>("save", function save(next) {
    if (this.password) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return next(err); }
            bcrypt.hash(this.password, salt)
                .then((hash) => {
                    this.password = hash;
                    next();
                })
                .catch((err2) => {
                    next(err2);
                });
        });
    } else {
        next();
    }
});

export interface IUser extends User, Document { _id?: ObjectId }
export const Users = model<IUser>('User', userSchema)
export interface IverifedToken {
    status: 'expired' | 'invalid' | 'valid';
    email?: string;
}

