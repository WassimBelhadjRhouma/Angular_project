import app from '../../src/app';
import * as request from 'supertest';
import { statusCode } from '../../src/utils/statusCode.utils';

describe("test GET /api/v0/terrain Should respond with 422 ", () => {

    it('token required', async () => {
        const res = await request(app).post('/api/v0/terrain/add')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    })
});