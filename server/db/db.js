var promise = require('bluebird');
const xsenv = require('@sap/xsenv');
const logger = require('../util/logger');

var options = {
  promiseLib: promise
};

options.schema = global.asc.db_schema;

// Logs all SQL to console
options.query = (e) => {
  logger.winston.debug(' ');
  logger.winston.debug(e.query);
  logger.winston.debug(' ');
};

if (global.asc.environment === 'dev' || global.asc.environment === 'test') {
  // Assumes that dev and test scripts are run locally
  global.asc.db_connection = process.env.db_dev_connection;
} else {
  global.asc.db_connection = xsenv.cfServiceCredentials({ tag: 'postgresql' }).uri;
}

var pgp = require('pg-promise')(options);
var db = pgp(global.asc.db_connection);

checkDB();

function checkDB() {
  db.one('select 1')
    .then(() => {
      logger.winston.info('DB Connected: ' + global.asc.environment);
    })
    .catch((err) => {
      logger.winston.error('DB Connection Error: ' + err);
    });
}

module.exports = db;
