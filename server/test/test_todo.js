const Helper = require("../api/todo");
const helper = new Helper();
const urlPrefix = "/api/";

describe("Forgot password endpoints", () => {
    it("Consuming API endpoint", async () => {
        const { body } = await helper.apiServer
            .get(`${urlPrefix}/todo/get-items/5d29b88d67acef1aa61398d6/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cnRoeXZlbXVyaTIxMUBnbWFpbC5jb20iLCJpYXQiOjE1ODY3OTE1NDZ9.RehtNQ1HZpdoTyKpk8IvOqvjEbp6BDZkq3727QIRyxzgTfIictzeklPyh0J8e-RPLoRps8lXJL9_409I0JgPDA`)
        expect(body).toHaveProperty("activities");
    });
});