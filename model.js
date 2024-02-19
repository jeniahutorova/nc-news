const db = require('./db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((topics) => {
        return { topics: topics.rows };
      });
}
exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then(({rows}) => {
        const user = rows[0];
        if (!user) {
          return Promise.reject({status: 400, msg:'Bad Request'});
        }
        return user;
      });
  };