import { Reservation } from "../models/reservation.model";

export const reservationRessource = {

    reservation: (reservation: Reservation) => {
        const data = {
            id: reservation._id,
            client: reservation.client,
            confirmed: reservation.confirmed,
            endAt: reservation.endAt,
            startAt: reservation.startAt,
            terrain: reservation.terrain
        }
        return data;
    }

}