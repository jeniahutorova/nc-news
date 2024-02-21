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
            const {topics} = response.body.topics
            expect(topics.length).toBe(3)
            topics.forEach((topic) => { 
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
        it('should get an articles array of article objects, each of which should have the following properties', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const {articles}= response.body.articles;
                articles.forEach((article) => {
                    expect(article).toHaveProperty('comment_count')
                })
            })
        });
        it('the articles should be sorted by date in descending order.', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const {articles} = response.body.articles;
                expect(articles.length).toBe(13)
                    articles.forEach((article) => {
                    expect(article).toHaveProperty('comment_count')
            })   
        });
    })
    it('the articles should be sorted by date in descending order.', () => {
        return request(app)
        .get('/api/articles?sort_by=created_at&order=desc')
        .expect(200)
        .then((response) => {
            const {articles} = response.body.articles;
            expect(articles).toBeSorted('created_at')
        });
    })
    it('400: returns bad request if passed an invalid parameter for sorting', () => {
        return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(400)
        .then((response) => {
            const {msg} = response.body;
            expect(msg).toBe('Bad Request')
        })
    })
    it('should sort in a desc order by default', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const {articles} = response.body.articles;
            expect(articles).toBeSortedBy("created_at",{descending: true})
        })
    })
describe('GET /api/articles/:article_id/comments', () => {
    it('an article object, which should have the following properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body;
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('article_id')
            })
            expect(comments[0].comment_id).toBe(5)
        })
    })
    it('should return 404 if passed valid but non-existing id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found')
        })
    })
    it('should return 400 if passed invalid id', () => {
        return request(app)
        .get('/api/articles/article/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
})
describe('POST /api/articles/:article_id/comments', () => {
    test('POST:201 inserts a new comment to the db and sends the new article back to the client', () => {
        const newComment = {
            "username": 'butter_bridge',
            "body": "This article really opened my eyes to a new perspective!",
    }  
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201)
          .then((response) => {
            expect(response.body.comment.author).toBe('butter_bridge');
            expect(response.body.comment.body).toBe("This article really opened my eyes to a new perspective!");
        })
    })
    test('POST:404 returns a error if article_id is valid but non-existing ', () => {
        const newComment = {
            "username": 'butter_bridge',
            "body": "This article really opened my eyes to a new perspective!",
    }  
        return request(app)
          .post('/api/articles/999/comments')
          .send(newComment)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Not Found')
        })
    })
    test('POST:400 returns a error if article_id is invalid', () => {
        const newComment = {
            "username": 'butter_bridge',
            "body": "This article really opened my eyes to a new perspective!"
    }  
        return request(app)
          .post('/api/articles/non-existing-id/comments')
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
    test('POST:400 returns a error if keys are missing', () => {
        const newComment = {
            "username": 'butter_bridge'
    }  
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
    test('POST:404 returns a error if username is not valid', () => {
        const newComment = {
            "username": 'happy_cat',
            "body": "This article really opened my eyes to a new perspective!"
    }  
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Not Found')
        })
    })
})
describe('PATCH /api/articles/:article_id', () => {
    test('PATCH:200 updates the votes of the specified article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
            const article = response.body
            expect(article.votes).toBe(110)
        })
    })
    test('PATCH:200 updates the votes of the specified article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -100 })
        .expect(200)
        .then((response) => {
            const article = response.body
            expect(article.votes).toBe(10)
        })
    })
    test('PATCH:404 returns a error if article_id is valid but non-existing', () => {
        return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: -100 })
        .expect(404)
        .then((response) => {
            const article = response.body
            expect(article.msg).toBe("Not Found")
        })
    })
    test('PATCH:400 returns a error if article_id is invalid', () => {
        return request(app)
        .patch('/api/articles/article')
        .send({ inc_votes: -100 })
        .expect(400)
        .then((response) => {
            const article = response.body
            expect(article.msg).toBe("Bad Request")
        })
    })
    test('PATCH:400 returns a error if votes are empty or missing a value', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then((response) => {
            const article = response.body
            expect(article.msg).toBe("Bad Request")
        })
    })
});

