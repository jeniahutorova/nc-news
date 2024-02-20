const db = require('./db/connection')
const fs = require('fs')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((topics) => {
        return { topics: topics.rows };
      });
}
exports.selectEndpoints = () => {
  try {
    const data = fs.readFileSync('endpoints.json', 'utf8');
    const endpoints = JSON.parse(data);
    return endpoints;
  } catch (err) {
    throw err;
  }
}
exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then(({rows}) => {
        const article = rows[0];
        if (!article) {
          return Promise.reject({status: 404, msg:'Not Found'});
        }
        return article;
      });
  };
  exports.selectArticles = (sort_by, order = 'desc') => {
  
  let sqlString = `SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`
  
  const validSortBy = ['created_at', 'votes', 'comment_count']
  
  if(validSortBy.includes(sort_by)){
    sqlString += `ORDER BY ${sort_by} ${order}`
  }
  sqlString += `;`

  return db.query(sqlString).then((articles) => {
    return { articles : articles.rows };
  });
  }
  