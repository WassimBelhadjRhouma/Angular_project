import app from '../src/app';
import * as request from 'supertest';
import { statusCode } from '../src/utils/statusCode.utils';




describe('Routes tests', () => {
    it('GET /ping It should respond with 200', async () => {
        const res = await request(app).get('/ping');
        expect(res.status).toBe(statusCode.SuccessOK);
    });
    it('Should respond with 404', async () => {
        const res = await request(app).get('/anything');
        expect(res.status).toBe(statusCode.ServerNotFound);
    });
    it('GET /api/v0/record Should respond with 404', async () => {
        const res = await request(app).get('/api/v0/record');
        expect(res.status).toBe(statusCode.ServerNotFound);
    });
});