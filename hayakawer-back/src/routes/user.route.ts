import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { userValidation } from '../validation/user.validation';

const userRoute = Router();

userRoute.get('/', userController.getCurrentUser);
userRoute.put('/update', userValidation.updateUser, userController.updateCurrentUser);
userRoute.delete('/delete', userController.deleteUser);


export default userRoute;
