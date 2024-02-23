const express = require('express')
const { getUsers } = require('./controller')

const usersRouter = express.Router()

usersRouter.get('/', getUsers)

module.exports = usersRouter