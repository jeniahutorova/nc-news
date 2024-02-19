const express = require('express')
const {getTopics, getArticleById} = require("./controller")
const app = express();

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)

app.use((err, request, response, next)=> {
    if (err.status && err.msg) {
      response.status(err.status).send({ msg: err.msg })
    }
    next(err)
  })
app.use((err, request, response, next) => {
    response.status(500).send({msg :'Internal Server Error'})
    next(err)
})
app.all('/*', (request, response, next) => {
    response.status(404).send({msg: "Endpoint not found"})
    next(err)
  })

module.exports = app
