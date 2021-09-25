import * as dotenv from "dotenv";
import * as morgan from 'morgan';
import * as  helmet from 'helmet'
import { streamWriterMorgan } from "./config/winston.config";
import * as compression from "compression";
dotenv.config({ path: `${__dirname}/../.env/.env.${process.env.NODE_ENV}` });

import * as express from 'express';
import appRoutes from './routes';

const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan('combined', { "stream": streamWriterMorgan }));

appRoutes(app);

export default app;