import app from './app';
import { mongooseConnect } from './config/db.config';
import { winston } from "./config/winston.config";

mongooseConnect
    .then(() => {
        app.listen(process.env.APP_PORT, () => {
            winston.info(`App is listening on port ${process.env.APP_PORT}`);
        });
    })
    .catch((e) => {
        winston.error(e, () => {
            process.exit(1);
        });
    });

