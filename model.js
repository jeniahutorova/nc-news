
const { userInfo } = require('os');
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
    return db.query(`SELECT 
      articles.*,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`, [article_id])
      .then(({rows}) => {
        const article = rows[0];
        if (!article) {
          return Promise.reject({status: 404, msg:'Not Found'});
        }
        return article;
      });
  };
  exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    
    let sqlString = `SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`
    
    const validTopic = []
    return db.query(`SELECT slug FROM topics`).then(({rows})=> {
      rows.forEach((row)=> validTopic.push(row.slug))
      if (topic && validTopic.includes(topic)) {
        sqlString += ` WHERE topic = '${topic}'`
      } else if (topic && !validTopic.includes(topic)) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      sqlString += ` GROUP BY articles.article_id`
      
      const validSortBy = ["created_at", "votes", "comment_count"]
      
      if(!validSortBy.includes(sort_by)){
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
      sqlString += ` ORDER BY ${sort_by} ${order}`
      sqlString += `;`
  
    return db.query(sqlString)
    }).then((articles)=> {
      return articles.rows
    })
  }
  
  exports.selectComments = (article_id) => {
    const queryValues = [];
    
    const sqlString = `
  SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
  FROM comments
  JOIN articles ON comments.article_id = articles.article_id
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
          return result.rows[0];
      });
  };
  exports.insertArticle = ({ article_id, inc_votes}) => {
    
    if(!article_id || !inc_votes){
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING * ;`, 
    [inc_votes, article_id]).then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg : "Not Found"})
      }
      return result.rows[0]
    })
  }

  exports.selectCommentById = ({comment_id}) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
      return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]);
    })
  }
  exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then((users) => {
      return users.rows
    })
  }
  exports.selectUsersByName = ({name}) => {
    if(!name){
      return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    return db.query(`SELECT * FROM users WHERE username = $1`, [name])
    .then((user) => {
      if(user.rows.length === 0){
        return Promise.reject({ status: 404, msg : "Not Found"})
      }
      return user.rows[0]
    } )
  }

  exports.insertCommentById = ({ comment_id, inc_votes}) => {
    
    if(!comment_id || !inc_votes){
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return db.query(`UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING * ;`, 
    [inc_votes, comment_id]).then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg : "Not Found"})
      }
      return result.rows[0]
    })
  }