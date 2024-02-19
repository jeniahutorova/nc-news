const express = require('express')
const {getTopics} = require("./controller")
const app = express();

app.get("/api/topics", getTopics)

app.all('/*', (request, response, next) => {
    response.status(404).send({msg: "Endpoint not found"})
    next(err)
  })
module.exports = app
