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
    });
})