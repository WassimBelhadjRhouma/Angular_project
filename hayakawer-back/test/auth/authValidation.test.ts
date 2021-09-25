import app from '../../src/app';
import * as request from 'supertest';
import { statusCode } from '../../src/utils/statusCode.utils';
import * as mongoose from 'mongoose';

// I added this so that I can push the word
jest.setTimeout(40000)

beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
});

afterAll(() => {
    mongoose.disconnect()
});

describe("test Post /api/v0/auth/signup Should respond with 422 ", () => {

    it('password required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                // password: "sasasaS43"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "password"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('email required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('email invalid', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9",
                email: "email.email"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('first name required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9",
                email: "email@email.email"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('last name required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9",
                email: "email@email.email",
                firstName: "firstname"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);

    });

    it('Region required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9",
                email: "email@email.email",
                firstName: "firstname",
                lastName: "lastname",
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('city required', async () => {
        const res = await request(app).post('/api/v0/auth/signup')
            .send({
                password: "Password9",
                email: "email@email.email",
                firstName: "firstname",
                lastName: "lastname",
                region: "efdfdf"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

});




describe("test Post /api/v0/auth/signin Should respond with 422 ", () => {

    it('email required', async () => {
        const res = await request(app).post('/api/v0/auth/signin')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

    it('email invalid', async () => {
        const res = await request(app).post('/api/v0/auth/signin')
            .send({
                email: "email.email"
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });


    it('password required', async () => {
        const res = await request(app).post('/api/v0/auth/signin')
            .send({
                email: "example@example.example"
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

});



describe("test Post /api/v0/auth/confirm-email Should respond with 422 ", () => {

    it('emailCode required', async () => {
        const res = await request(app).get('/api/v0/auth/confirm-email')
            .query({})

        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });
    it('emailCode must be string', async () => {
        const res = await request(app).get('/api/v0/auth/confirm-email')
            .send({
                emailCode: 211
            })

        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

});



describe("test Post /api/v0/auth/ask-reset-password Should respond with 422 ", () => {

    it('email required', async () => {
        const res = await request(app).post('/api/v0/auth/ask-reset-password')
            .send({
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });
    it('email invalid', async () => {
        const res = await request(app).post('/api/v0/auth/ask-reset-password')
            .send({
                email: "example@wdw"
            })

        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

});


describe("test Get /api/v0/auth/reset-password Should respond with 422 ", () => {

    it('password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number', async () => {
        const res = await request(app).post('/api/v0/auth/reset-password')
            .send({
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number', async () => {
        const res = await request(app).post('/api/v0/auth/reset-password')
            .send({
                password: "password"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

    it('confirmationCode required', async () => {
        const res = await request(app).post('/api/v0/auth/reset-password')
            .send({
                password: "Password9"
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });
    it('confirmationCode nust be string', async () => {
        const res = await request(app).post('/api/v0/auth/reset-password')
            .send({
                password: "Password9",
                emailCode: 211
            });
        expect(res.status).toBe(statusCode.ClientErrorBadRequest);
    });

});

describe("test POST /api/v0/user/profile Should respond with 422 ", () => {

    it('Bearer token required', async () => {
        const res = await request(app).get('/api/v0/user')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

});


// fb & google passport Tests
describe("test POST /api/v0/auth/signin/ google|fb Should respond with 422 ", () => {

    it('FB access_token required', async () => {
        const res = await request(app).post('/api/v0/auth/signin/fb')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

    it('Google access_token required', async () => {
        const res = await request(app).post('/api/v0/auth/signin/google')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

});


