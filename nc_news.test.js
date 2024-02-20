const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data");
const request = require("supertest");
const app = require("./app");


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
})
describe(`GET /api`, () => {
    it('should respond with the correct structure as defined in endpoints.json', () => {
     const endpoints = require("./endpoints.json")
      return request(app)
      .get('/api')
      .expect(200)
      .then((response)=> {
          expect(response.body).toEqual(endpoints);
        })
    })
})
    describe('GET /api/articles', () => {
        it('an article object, which should have the following properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const {article} = response.body;
                expect(article.article_id).toBe(1)
                })
        });
        it('GET:404 sends an appropriate status and error message when given an valid but non-existing id', () => {
            return request(app)
              .get('/api/articles/115')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Not Found');
              });
          })
          it('GET:400 sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/non-existing-id')
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
              });
          });
    })
    describe('GET /api/articles', () => {
        it('should get an articles array of article objects, each of which should have the following properties', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                articles.articles.forEach((article) => {
                    expect(article).toHaveProperty('comment_count')
                })
            })
        });
        // it('the articles should be sorted by date in descending order.', () => {
        //     return request(app)
        //     .get('/api/articles?sort_by=comment_count')
        //     .expect(200)
        //     .then((response) => {
        //         const articles = response.body.articles;
        //         console.log(articles)
        //         articles.articles.forEach((article) => {
        //             expect(article).toHaveProperty('comment_count')
        //     })   
        // });
    })
