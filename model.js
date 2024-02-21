
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
        console.log(article)
        if (!article) {
          return Promise.reject({status: 404, msg:'Not Found'});
        }
        return article;
      });
  };
  exports.selectArticles = (sort_by = "created_at", order = "desc") => {
  
  let sqlString = `SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`
  
  const validSortBy = ["created_at", "votes", "comment_count"]
  
  if(!validSortBy.includes(sort_by)){
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  
  sqlString += ` ORDER BY ${sort_by} ${order}`
  sqlString += `;`

  return db.query(sqlString).then((articles) => {
    return { articles : articles.rows };
  });
  }
  
  exports.selectComments = (article_id) => {
    const queryValues = [];
    
    const  sqlString = `SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
    FROM comments
    LEFT JOIN articles
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    ORDER BY comments.created_at DESC`
    
    if (!article_id) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
  }
    queryValues.push(article_id)
  
    return db.query(sqlString, queryValues)
    .then((article) => {
      if(article.rows.length === 0){
        return Promise.reject({status: 404, msg:'Not Found'});
      }
    return article.rows
    })
  }

  exports.insertComment = ({ article_id, username, body }) => {
    const commentData = {
      author: username, 
      body: body
    }
    if (!article_id || !username || !body) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    } 
    
      return db
        .query(`INSERT INTO comments (article_id, author, body) 
        VALUES ($1, $2, $3) 
        RETURNING *;`,
          [article_id, commentData.author, commentData.body]
        )
        .then((result) => {
          console.log(result)
          return result.rows[0];
        });
    
  };