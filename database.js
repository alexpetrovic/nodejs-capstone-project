const sqlite3 = require('sqlite3').verbose();
const message = require('./constants/message.constants');
const query = require('./constants/query.constants');
const DATABASE_PATH = './database.db';

const db = new sqlite3.Database(
  DATABASE_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(message.DATABASE_CONNECTION_ERROR, err.message);
      return;
    }
    console.log(message.DATABASE_CONNECTED);
    createTables();
  }
);

const createTables = () => {
  db.serialize(() => {
    db.run(query.CREATE_TABLE_USERS, (error) => {
      if (error) {
        console.error(message.CREATE_TABLE_USERS_ERROR, error.message);
      }
    });

    db.run(query.CREATE_TABLE_EXERCISES, (error) => {
      if (error) {
        console.error(message.CREATE_TABLE_EXERCISES_ERROR, error.message);
      }
    });
  });
};

module.exports = db;
