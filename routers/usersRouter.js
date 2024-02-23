const express = require('express')
const { getUsers, getUsersByName  } = require('../controller')

const usersRouter = express.Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:username', getUsersByName)

module.exports = usersRouter