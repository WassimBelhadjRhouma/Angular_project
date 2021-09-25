import { Router } from 'express';
import { usersController } from '../controller/users.controller';
import { usersValidation } from '../validation/users.validation';
import { paginationMiddleware } from '../middlewares/pagination.middleware';
import { checkRole } from '../middlewares/permission.middleware';
import { Role } from '../models/user.model';
import { terrainValidation } from '../validation/terrain.validation';

const usersRoute = Router();

usersRoute.post('/', checkRole([Role.admin]), usersValidation.getUsers, paginationMiddleware, usersController.getUsers);
usersRoute.delete('/delete', checkRole([Role.admin]), usersValidation.deleteUser, usersController.deleteUser);
usersRoute.put('/update', checkRole([Role.admin]), usersValidation.updateUser, usersController.updateUser);
usersRoute.post('/stats', checkRole([Role.admin]), usersValidation.getUsers, usersController.getGovUserStats);
usersRoute.post('/terrain/stats', checkRole([Role.admin]), terrainValidation.adminGetTerrain, usersController.getGovTerrainStats);
usersRoute.get('/stats/deletedaccounts', checkRole([Role.admin]), usersController.getGovTerrainStats);
usersRoute.get('/stats/reservations', checkRole([Role.admin]), usersController.getGovTerrainStats);

usersRoute.get('/stats', checkRole([Role.admin]), usersController.getTotalStat);

// to add stat in database
// usersRoute.post('/newStat', checkRole([Role.admin]), usersController.addStat);



export default usersRoute;