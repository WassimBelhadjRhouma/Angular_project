import app from '../../src/app';
import * as request from 'supertest';
import { statusCode } from '../../src/utils/statusCode.utils';

describe("test GET /api/v0/user/update Should respond with 422 ", () => {

    it('token required', async () => {
        const res = await request(app).put('/api/v0/user/update')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    })
});