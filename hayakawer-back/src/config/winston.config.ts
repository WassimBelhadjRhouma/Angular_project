import { createLogger, format, transports } from "winston";

export const winston = createLogger({
    level: 'info',
    format: format.combine(
        format.json(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.prettyPrint()
    ),
    transports: [
        new transports.Console({
            format: format.simple(),
        })
    ],
});

export const streamWriterMorgan = {
    write: (message) => {
        if (process.env.NODE_ENV !== 'test')
            winston.info(message);
    },
};

if (process.env.NODE_ENV === 'prod') {
    winston.transports.concat([
        new transports.File({ filename: `${__dirname}/../../logs/combined.log` }),
        new transports.File({ filename: `${__dirname}/../../logs/error.log`, level: 'error' }),
        new transports.File({ filename: `${__dirname}/../../logs/warning.log`, level: 'warn' }),
        new transports.File({ filename: `${__dirname}/../../logs/info.log`, level: 'info' })
    ]);
}