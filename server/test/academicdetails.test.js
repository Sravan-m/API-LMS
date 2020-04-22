const request = require('supertest')
const app = require('../app')

describe('Jagan', () => {

    it('Siva', async (done) => {
        const res = await request(app)
        .get('/api/academicdetails/required/courses/completion/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhaXZpcHVsMTVAbXNpdHByb2dyYW0ubmV0IiwiaWF0IjoxNTg3NDYzNzMxfQ.kObIEv-vUC8hmYSmTUpZt0usPW68Z_BPstb18Lzczmhr9pG0Q8H0-txSMZwibxyBY1R91ZKPyvTafC1nidl-4w');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status');
		done();
    });
})