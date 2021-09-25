import { winston } from "../config/winston.config";
import { statusCode } from "./statusCode.utils";
import { Request, Response, NextFunction } from 'express'
export const globalError = (err, req: Request, res: Response, next: NextFunction) => {
    winston.error(err);
    return errorResponse(res);
}

export const successResponse = (res: Response, data) => (
    res.status(statusCode.SuccessOK).send(data)
);

export const errorResponse = (res: Response) => (
    res.status(statusCode.ServerErrorInternal).send()
);

export const validationErrorResponse = (res: Response, data) => (
    res.status(statusCode.ClientErrorBadRequest).send(data)
);

export const NotFoundErrorResponse = (res: Response) => (
    res.status(statusCode.ServerNotFound).send()
);

export const unauthorizedResponse = (res: Response, data?) => (
    res.status(statusCode.unauthorized).send(data)
);

export const forbiddenResponse = (res: Response) => (
    res.status(statusCode.forbidden).send()
);