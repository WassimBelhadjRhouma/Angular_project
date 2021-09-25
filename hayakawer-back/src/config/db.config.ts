import * as mongoose from 'mongoose';

export const mongooseConnect = new Promise<void>((resolve, reject) => {
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(() => {
        resolve();
    }).catch((e) => {
        reject(e);
    });
});
