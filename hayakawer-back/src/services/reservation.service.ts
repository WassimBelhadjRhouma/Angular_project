import { IReservation, Reservations } from "../models/reservation.model";

export const reservationService = {

    addReservation: (data: any): Promise<IReservation> => {
        return new Promise<IReservation>(async (resolve, reject) => {
            await Reservations.create(data)
                .then((reservation: IReservation) => {
                    resolve(reservation)
                }).catch((err) => reject(err))
        });
    },

    getReservation: (filter: object): Promise<IReservation> => {
        return new Promise<IReservation>(async (resolve, reject) => {
            await Reservations.findOne(filter)
                .populate("terrain")
                .populate("client")
                .then((reservation) => {
                    resolve(reservation)
                })
                .catch((err) => reject(err))
        });
    },
    getManyReservations: (filter: object): Promise<IReservation> => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const result = await Promise.all([
                    Reservations.find(filter)
                        .populate('terrain')
                        .populate('client').exec()
                ]);
                resolve(result)
            }
            catch (err) {
                reject(err);
            }
        });
    },
    deleteReservation: (filter: object): Promise<IReservation> => {
        return new Promise<IReservation>(async (resolve, reject) => {
            await Reservations.findOneAndDelete(filter)
                .populate('terrain')
                .populate('client').exec()
                .then((reservation) => resolve(reservation))
                .catch((err) => reject(err))
        });
    },
    updateReservation: (filter, update, option = { new: false }): Promise<IReservation> => {
        return new Promise<IReservation>(async (resolve, reject) => {
            await Reservations.findOneAndUpdate(filter, update, option)
                .then((reservation) => resolve(reservation))
                .catch((err) => reject(err))
        });
    },


}