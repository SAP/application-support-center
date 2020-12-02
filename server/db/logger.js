module.exports = {
  logToDB
};

const db = require('./db');
const logger = require('../util/logger');

function logToDB(appId, event, description) {
  db.none('insert into log (app_id, event, description) values ($1, $2, $3)', [appId, event, description])
    .catch((err) => {
      if (err) {
        logger.winston.error('Error inserting a new record: ' + err);
      }
    });
}
