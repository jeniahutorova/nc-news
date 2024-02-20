const express = require('express')
const { getTopics, getArticleById, getArticles, getEndpoints } = require("./controller")
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles )
app.get('/api', getEndpoints);

app.use((err, request, response, next)=> {
    if (err.status && err.msg) {
      response.status(err.status).send({ msg: err.msg })
    }
    next(err)
  })
app.use((err, request, response, next) => {
  if(err.status = '22P02'){
    response.status(400).send({msg :'Bad Request'})
  }else {
    response.status(500).send({msg :'Internal Server Error'})
    next(err)
  }
})
app.all('/*', (request, response, next) => {
    response.status(404).send({msg: "Endpoint not found"})
    next(err)
  })

module.exports = app
