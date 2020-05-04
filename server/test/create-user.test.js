const request = require('supertest')
const app = require('../app')

describe('create-user', () => {

    it("/api/registration/register", async (done) => {
        const res = await request(app)
        .post(`/api/registration/register`)
        .send({
            firstName: "World",
            lastName: "Hello",
            image: "./uploads/World_Hello.txt",
            email:"help1@msitprogram.com",
            role: "admin",
            userID: "help"
        })
        expect(res.statusCode).toEqual(200);
		done();
    });

})