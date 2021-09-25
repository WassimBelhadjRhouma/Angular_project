export const paginationMiddleware = (req, res, next) => {
    if (isNaN(req.body.limit) || req.body.limit < 1) {
        req.body.limit = 10;
    }
    if (isNaN(req.body.page) || req.body.page < 1) {
        req.body.page = 1;
    }
    next();
}