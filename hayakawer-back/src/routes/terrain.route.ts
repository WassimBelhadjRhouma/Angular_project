import { Router } from 'express';
import { terrainController } from '../controller/terrain.controller';
import { paginationMiddleware } from '../middlewares/pagination.middleware';
import { checkRole } from '../middlewares/permission.middleware';
import { Role } from '../models/user.model';
import { terrainValidation } from '../validation/terrain.validation';

const terrainRoute = Router();

terrainRoute.post('/add', checkRole([Role.admin, Role.proprietaire]), terrainValidation.addTerrain, terrainController.addTerrain);

terrainRoute.put('/update', checkRole([Role.admin, Role.proprietaire]), terrainValidation.updateTerrain, terrainController.updateTerrain);

terrainRoute.delete('/delete', checkRole([Role.admin, Role.proprietaire]), terrainValidation.deleteTerrain, terrainController.deleteTerrain);

terrainRoute.get('/admin', checkRole([Role.admin]), terrainValidation.adminGetTerrain, paginationMiddleware, terrainController.getTerrains);

terrainRoute.post('/owner', checkRole([Role.proprietaire, Role.admin]), terrainValidation.getTerrain, paginationMiddleware, terrainController.getOwnerTerrains);

terrainRoute.get('/detail', terrainController.getSingleTerrain);

terrainRoute.post('/client', terrainValidation.getTerrain, paginationMiddleware, terrainController.getTerrains);

terrainRoute.post('/favorite/add', terrainValidation.manageFavorite, terrainController.addFavorite);
terrainRoute.delete('/favorite/delete', terrainValidation.manageFavorite, terrainController.removeFavorite);
terrainRoute.post('/all', terrainValidation.getTerrain, terrainController.getAll);
terrainRoute.get('/favorite', terrainController.getFavorite);

export default terrainRoute;
