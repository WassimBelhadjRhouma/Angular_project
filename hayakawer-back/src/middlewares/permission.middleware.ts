import { Role } from "../models/user.model";
import { forbiddenResponse } from "../utils/response.utils";

export const checkRole = (roles: Role[]) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.userType)) {
            return forbiddenResponse(res);
        }
        next();
    }
}