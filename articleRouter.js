const express = require('express')
const { getComments, postComment, getArticleById, getArticles, patchArticles} = require('./controller')

const articleRouter = express.Router()

articleRouter.get('/:article_id', getArticleById)
articleRouter.get('/', getArticles)
articleRouter.patch('/:article_id', patchArticles)
articleRouter.get('/:article_id/comments', getComments)
articleRouter.post('/:article_id/comments', postComment)

module.exports = articleRouter