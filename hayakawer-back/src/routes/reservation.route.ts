import { Router } from 'express';
import { checkRole } from '../middlewares/permission.middleware';
import { Role } from '../models/user.model';
import { reservationValidation } from '../validation/reservation.validation';
import { reservationController } from '../controller/reservation.controller';

const reservationRoute = Router();

reservationRoute.post('/reserve', reservationValidation.addReservation, reservationController.addReservation);
reservationRoute.get('/', reservationController.getReservation);
reservationRoute.delete('/cancel', reservationController.refuseReservation);
reservationRoute.put('/accept', checkRole([Role.proprietaire, Role.admin]), reservationValidation.acceptReservation, reservationController.acceptReservation);

export default reservationRoute;