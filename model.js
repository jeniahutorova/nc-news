const db = require('./db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((topics) => {
        console.log(topics)
        return { topics: topics.rows };
      });
}