const express = require('express')
const {deleteCommentById, patchComment} = require('../controller')

const commentRouter = express.Router()

commentRouter.delete('/:comment_id', deleteCommentById)
commentRouter.patch('/:comment_id', patchComment)
module.exports = commentRouter