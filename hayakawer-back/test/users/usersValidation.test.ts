import app from '../../src/app';
import * as request from 'supertest';
import { statusCode } from '../../src/utils/statusCode.utils';

describe("test GET /api/v0/users Should respond with 422 ", () => {

    it('invalid filter attributes', async () => {
        const res = await request(app).get('/api/v0/users')
            .send({
            });
        expect(res.status).toBe(statusCode.unauthorized);
    });

});