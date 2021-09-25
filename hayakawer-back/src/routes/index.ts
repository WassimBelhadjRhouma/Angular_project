import * as cors from 'cors';
import { globalError, NotFoundErrorResponse } from '../utils/response.utils';
import * as swagger from 'swagger-ui-express';
import * as swaggerConfig from '../../swagger.json'
import * as express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import usersRoute from './users.route';
import { passportMiddleware } from '../middlewares/passport.middleware';
import terrainRoute from './terrain.route';
import reservationRoute from './reservation.route';

export default function appRoutes(app) {
    app.use(cors());
    app.use(express.json());
    app.get('/ping', async (_req, res) => {
        res.send('PONG API HAYAKAWER');
    });

    app.use('/api/v0/docs', swagger.serve, swagger.setup(swaggerConfig));
    app.use('/api/v0/auth', authRoute);
    app.use('/api/v0/user', passportMiddleware.passportJwtProtect, userRoute);

    app.use('/api/v0/terrain', passportMiddleware.passportJwtProtect, terrainRoute);

    app.use('/api/v0/users', passportMiddleware.passportJwtProtect, usersRoute);

    app.use('/api/v0/reservation', passportMiddleware.passportJwtProtect, reservationRoute);

    app.use('*', async (req, res) => {
        return NotFoundErrorResponse(res);
    });
    app.use(globalError)
}