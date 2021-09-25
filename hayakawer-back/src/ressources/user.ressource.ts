import { User } from "../models/user.model";

export const userRessource = {

    profile: (user: User) => {
        const data = {
            email: user.email,
            emailConfirmed: user.emailConfirmed,
            firstName: user.firstName,
            lastName: user.lastName,
            region: user.region,
            city: user.city,
            userType: user.userType,
            password: user.password?.length > 0 ? true : false,
            reservations: user.reservation,
            terrain: user.terrain
        }
        return data;
    },
    admin: (user: User) => {
        const data = {
            _id: user._id,
            email: user.email,
            emailConfirmed: user.emailConfirmed,
            firstName: user.firstName,
            lastName: user.lastName,
            region: user.region,
            city: user.city,
            userType: user.userType,
            isBlocked: user.isBlocked
        }
        return data;
    }

}