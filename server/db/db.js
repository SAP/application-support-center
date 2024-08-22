var promise = require('bluebird');
const xsenv = require('@sap/xsenv');
const logger = require('../util/logger');

var options = {
  promiseLib: promise
};

var pgOptions = {};

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
  pgOptions = process.env.db_dev_connection;
} else {
  var params = xsenv.cfServiceCredentials({ tag: 'postgresql' });
  pgOptions = {
    user: params.username,
    password: params.password,
    host: params.hostname,
    port: params.port,
    database: params.dbname
  };

  pgOptions.ssl = {
    require: params.sslrootcert,
    rejectUnauthorized: false
  };
}

var pgp = require('pg-promise')(options);
var db = pgp(pgOptions);

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
