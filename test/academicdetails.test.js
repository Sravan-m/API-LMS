const request = require('supertest')
const app = require('../app')

describe('Jagan', () => {

    it('is checking with endpoint to get the required course details', async (done) => {
        const res = await request(app)
        .get('/api/academicdetails/required/courses/completion/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhaXZpcHVsMTVAbXNpdHByb2dyYW0ubmV0IiwiaWF0IjoxNTg3NDYzNzMxfQ.kObIEv-vUC8hmYSmTUpZt0usPW68Z_BPstb18Lzczmhr9pG0Q8H0-txSMZwibxyBY1R91ZKPyvTafC1nidl-4w');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status');
		done();
    });

    it('is checking with endpoint to get the required course details', async (done) => {
        const res = await request(app)
        .get('/api/academicdetails/required/courses/completion/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpc2hpa2FoYXJpdGhhQG1zaXRwcm9ncmFtLm5ldCIsImlhdCI6MTU4NzYyMTMwOX0.F6FuGMZmDVct6f4_4m1MPEAj2TeTzEH3D4gCVBcB2dKoC_56hbbs6ZRc960vdECFwU5m8u3vH_40tqgfQhSLsQ');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status');
		done();
    });

	it('is checking with endpoint to get the required course details', async (done) => {
        const res = await request(app)
        .get('/api/academicdetails/required/courses/completion/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpc2hpa2FoYXJpdGhhQG1zaXRwcm9ncmFtLm5ldCIsImlhdCI6MTU4NzYyMTMwOX0.F6FuGMZmDVct6f4_4m1MPEAj2TeTzEH3D4gCVBcB2dKoC_56hbbs6ZRc960vdECFwU5m8u3vH_40tqgfQhSLs');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
		done();
    });

	it('is checking with endpoint to get the required course details', async (done) => {
        const res = await request(app)
        .get('/api/academicdetails/required/courses/completion/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RjYXNlQG1zaXRwcm9ncmFtLm5ldCIsImlhdCI6MTU4NzYyMTk2OX0.m36oXEGlMRQfmD1oppK_xUU9kOI4OMOqw19hhLRrrjEgyHe-iPN2bxvFV-DUaPwjlJiOx-sHRRGWNlyiFjJxdw');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status');
		done();
    });
})