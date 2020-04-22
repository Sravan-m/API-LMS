const request = require('supertest')
const app = require('../app')

describe('Post Endpoints', () => {

    it("Consuming API endpoint - 2", async (done) => {
        const res = await request(app)
        .get(`/api/todo/get-items/5d29b88d67acef1aa61398d6/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cnRoeXZlbXVyaTIxMUBnbWFpbC5jb20iLCJpYXQiOjE1ODY3OTE1NDZ9.RehtNQ1HZpdoTyKpk8IvOqvjEbp6BDZkq3727QIRyxzgTfIictzeklPyh0J8e-RPLoRps8lXJL9_409I0JgPDA`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('activities');
		done();
    });

    it("Consuming API endpoint - 2", async (done) => {
        const res = await request(app)
        .get(`/api/todo/todo-list/5d29b88d67acef1aa61398d6/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cnRoeXZlbXVyaTIxMUBnbWFpbC5jb20iLCJpYXQiOjE1ODY3OTE1NDZ9.RehtNQ1HZpdoTyKpk8IvOqvjEbp6BDZkq3727QIRyxzgTfIictzeklPyh0J8e-RPLoRps8lXJL9_409I0JgPDA`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('activities');
		done();
    });

})
