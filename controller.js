const {selectTopics, selectArticleById, selectArticles, selectEndpoints, selectComments, insertComment} = require("./model")

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
    console.log('article_id:', article_id); // Log the value of article_id
    console.log('username:', username); // Log the value of username
    console.log('body:', body); 
    insertComment({article_id, username , body}).then((comment) => {
      res.status(201).send({ comment });
    }).catch((err) => {
      next(err)
     })
  };