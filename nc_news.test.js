const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data");
const request = require("supertest");
const app = require("./app");
const endpoints = require('./endpoints.json')
const fs = require('fs')

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    it('should an array of topic objects, each of which should have the following properties', () => {
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
    })
    it('an article object, which should have the following properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const {article} = response.body;
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('article_id')
            expect(article).toHaveProperty('body')
            expect(article).toHaveProperty('topic')
            expect(article).toHaveProperty('created_at')
            expect(article).toHaveProperty('votes')
            expect(article).toHaveProperty('article_img_url')
        })
    });
    it('GET:400 sends an appropriate status and error message when given an valid but non-existing id', () => {
        return request(app)
          .get('/api/articles/115')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
          });
      })
      it('GET:500 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/non-existing-id')
          .expect(500)
          .then((response) => {
            expect(response.body.msg).toBe('Internal Server Error');
          });
      });
});