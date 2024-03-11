const express = require('express')
const { getEndpoints } = require("./controller")
const cors = require('cors');

const app = express();
app.use(cors());
const articleRouter = require('./routers/articleRouter');
const commentRouter = require('./routers/commentRouter');
const usersRouter = require('./routers/usersRouter');
const topicsRouter = require('./routers/topicsRouter');


app.use(express.json());

app.use('/api/articles', articleRouter);
app.use('/api/topics', topicsRouter)
app.use("/api/comments", commentRouter);
app.use('/api/users', usersRouter)
app.get("/api", getEndpoints);

app.use((err, request, response, next)=> {
    if (err.status && err.msg) {
      response.status(err.status).send({ msg: err.msg })
    }
    next(err)
  })
app.use((err, request, response, next) => {
  if(err.code === '22P02'){
    response.status(400).send({msg :'Bad Request'})
  }
  next(err)
})

app.use((err, request, response, next) => {
  if(err.code === '23503'){
    response.status(404).send({msg : "Not Found"})
  }
  next(err)
})
app.use((err, request, response, next) => {
  response.status(500).send({msg :'Internal Server Error'})
})
app.all('/*', (request, response, next) => {
    response.status(404).send({msg: "Endpoint not found"})
  })

module.exports = app
