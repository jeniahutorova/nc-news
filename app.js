const express = require('express')
const { getTopics, getArticleById, getArticles, getEndpoints, getComments, postComment } = require("./controller")
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles )
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id/comments", getComments)

app.post('/api/articles/:article_id/comments', postComment);

app.use((err, request, response, next)=> {
    if (err.status && err.msg) {
      response.status(err.status).send({ msg: err.msg })
    }
    next(err)
  })
app.use((err, request, response, next) => {
  if(err.status = '22P02'){
    response.status(400).send({msg :'Bad Request'})
  } 
  next(err)
})
app.use((err, request, response, next) => {
  response.status(500).send({msg :'Internal Server Error'})
})

app.all('/*', (request, response, next) => {
    response.status(404).send({msg: "Endpoint not found"})
    next(err)
  })

module.exports = app
