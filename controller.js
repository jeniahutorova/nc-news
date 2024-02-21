const {selectTopics, selectArticleById, selectArticles, selectEndpoints, selectComments, insertComment, insertArticle, selectCommentById} = require("./model")

exports.getTopics = (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
     }).catch((err) => {
        next(err)
     })
}
exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch((err) => {
      next(err)
     })
  };

  exports.getEndpoints = (req,res,next) => {
    try {
      const endpoints = selectEndpoints();
      res.status(200).json(endpoints);
    } catch (err){
      next(err);
    }
  }

  exports.getArticles = (req,res,next) => {
    const {sort_by, order} = req.query
    selectArticles(sort_by, order).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
  }

  exports.getComments = (req,res,next) => {
    const { article_id } = req.params;
    selectComments(article_id).then((comments) => {
      res.status(200).send(comments)
    }).catch((err) => {
      next(err)
    })
  }

  exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const {username, body}= req.body;
    
    insertComment({article_id, username , body}).then((comment) => {
      res.status(201).send({ comment });
    }).catch((err) => {
      next(err)
     })
  };

  exports.patchArticles = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    insertArticle({ article_id, inc_votes}).then((article) => {
      res.status(200).send(article)
    }).catch((err) => {
      next(err)
    })
  }

  exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    selectCommentById({comment_id}).then(() => {
      res.status(204).send()
    }).catch((err) => { 
      next(err)
    })
  }