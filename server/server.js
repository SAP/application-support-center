require('dotenv').config();

// Global Variables/Config Options pulled from .env file, placed before require because of some of the modules are using these variables
// Required
global.asc = {};
global.asc.jwtsecret = process.env.jwtsecret || '';
global.asc.loglevel = process.env.loglevel || 'info';
global.asc.db_connection = '';
global.asc.db_schema = process.env.db_schema || 'asc';

// Optional Variables
global.asc.static_access_tokens = process.env.static_access_tokens ? process.env.static_access_tokens.split(' ') : '';
global.asc.prod_jamf_endpoint = process.env.prod_jamf_endpoint || '';
global.asc.prod_jamf_username = process.env.prod_jamf_username || '';
global.asc.prod_jamf_password = process.env.prod_jamf_password || '';
global.asc.test_jamf_endpoint = process.env.test_jamf_endpoint || '';
global.asc.test_jamf_username = process.env.test_jamf_username || '';
global.asc.test_jamf_password = process.env.test_jamf_password || '';
global.asc.server_port = process.env.PORT || '5001';
global.asc.server_url = process.env.URL || 'http://localhost';
global.asc.environment = process.env.npm_lifecycle_event;
global.asc.prod_slack_webhook_url = process.env.prod_slack_webhook_url || '';
global.asc.dev_slack_webhook_url = process.env.dev_slack_webhook_url || '';
global.asc.smtp_host = process.env.smtp_host || '';
global.asc.smtp_port = process.env.smtp_port || '';
global.asc.smtp_user = process.env.smtp_user || '';
global.asc.smtp_password = process.env.smtp_password || '';

// SAP Specific Code
global.asc.tracking_bearer_token = process.env.tracking_bearer_token;
global.asc.usage_stats_url = process.env.usage_stats_url;

// 3rd Party Modules
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const xsenv = require('@sap/xsenv');
const serveIndex = require('serve-index');
const app = express();
const cfenv = require('cfenv');
const cors = require('cors');

// ASC Modules
const logger = require('./util/logger');
const routes = require('./routes/index');
const auth = require('./db/auth');
const storage = require('./db/storage');
const cron = require('./db/cron');

// Express configuration options for files/json
app.use(
  bodyParser.urlencoded({
    parameterLimit: 10000,
    limit: '200mb',
    extended: true
  }),
  bodyParser.json({
    limit: '200mb'
  })
);

// Swagger API Setup
const swaggerDocument = YAML.load('./resources/swagger.yaml');
var swaggerOptions = {
  swaggerOptions: {
    docExpansion: 'none'
  }
};
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Configure Bearer Token Support for external SDK and Portal Access
app.use(passport.initialize());
// eslint-disable-next-line consistent-return
passport.use(new BearerStrategy((token, done) => {
  if (global.asc.static_access_tokens.includes(token)) {
    return done(null, { static_bearer: true, data: { user: 'static_bearer' } });
  }
  auth.validateBearerToken(token, (data, error) => {
    if (error) {
      logger.winston.info(error);
    }
    return done(null, data);
  });
}));

// Development environment specific configuration and settings
if (global.asc.environment === 'dev' || global.asc.environment === 'test') {
  // development error handler, will print stacktrace
  app.use((err, req, res, next) => {
    res.status(err.code || 500).json({
      status: 'error',
      message: err
    });
  });

  // Serve static files for UI website
  app.use('/admin', express.static('../adminui/webapp/'));

  // Serve static DIST files for testing website
  app.use('/admin/dist', express.static('../adminui/dist/'));

  // Serve static files for Landing page on root
  app.use('/', express.static('../router/webapp/'));

  // Serve static files for Landing page on root
  app.use('/', express.static('../router/public/'));

  // Serve static files for portal UI
  app.use('/portal', express.static('../portalui/webapp/'));

  // Check the source of the request and Add Bearer Auth ONLY to server
  // Uncomment to test bearer tokens in dev
  // app.use(passport.authenticate('bearer', { session: false }));
} else {
  // production error handler, no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: 'Error'
    });
  });

  // Get Cloud Foundry VCAP Variables and clear the server_url
  global.asc.server_url = '';
  global.asc.server_port = cfenv.getAppEnv().port;

  // Validate that the users is authenticated before allowing access
  passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
  app.use(passport.authenticate(['JWT', 'bearer'], { session: false }));
}

// Serve static files for server resources
global.asc.resources_dir = storage.getStorageDir() === '' ? './resources/' : storage.getStorageDir();

// Check folders exist
storage.checkStorageFoldersExist(global.asc.resources_dir);

// This provides directory listing/browsing of uploaded IPA's and App Icons, remove serveIndex for security purposes if needed
// app.use('/serverresources', express.static(global.asc.resources_dir));
app.use('/serverresources', express.static(global.asc.resources_dir), serveIndex(global.asc.resources_dir, { icons: true }));

// Enable cors
//app.get('*', ); // include before other routes

// Inject app routes
app.use('/api/v1/', routes);

// Start cron job for cehcking provisioning profile
cron.runJobCheck();

const server = require('http').createServer(app);
server.listen(global.asc.server_port);

if (global.asc.environment === 'dev' || global.asc.environment === 'test') {
  logger.winston.info('  App Info\n');
  logger.winston.info('- Environment:             ' + global.asc.environment);
  logger.winston.info('- API Endpoint:            ' + global.asc.server_url + ':' + global.asc.server_port + '/api/v1');
  logger.winston.info('- API Documentation:       ' + global.asc.server_url + ':' + global.asc.server_port + '/api/v1/docs\n\n');

  logger.winston.info('- Landing UI:              ' + global.asc.server_url + ':' + global.asc.server_port + '/');
  logger.winston.info('- Admin UI:                ' + global.asc.server_url + ':' + global.asc.server_port + '/admin');
  logger.winston.info('- DIST Admin UI:           ' + global.asc.server_url + ':' + global.asc.server_port + '/admin/dist');
  logger.winston.info('- Portal UI:               ' + global.asc.server_url + ':' + global.asc.server_port + '/portal');
  logger.winston.info('- Integration tests:       ' + global.asc.server_url + ':' + global.asc.server_port + '/admin/test/integration/opaTests.qunit.html\n\n');

  logger.winston.info('- Log Level:               ' + global.asc.loglevel + '\n\n');
}

module.exports = server;
