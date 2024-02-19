const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data");
const request = require("supertest");
const app = require("./app");


beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    it('should be available on endpoint /api/topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=> {
            const {topics} = response.body
            expect(topics.topics.length).toBe(3)
            topics.topics.forEach((topic) => { 
            expect(topic).toHaveProperty('slug')
            expect(topic).toHaveProperty('description')
           })
        })
    })
    it('404 sends an appropriate status and error message when given a valid but non-existent endpoint ', () => {
        return request(app)
            .get('/api/nonexistent-endpoint')
            .expect(404)
            .then((response) => {
                expect(response.status).toBe(404)
                expect(response.body.msg).toBe("Endpoint not found")
        })
    });
})