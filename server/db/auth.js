module.exports = {
  getRole,
  getLoggedInUser,
  validateBearerToken,
  checkACL,
  denyBearerToken
};

const db = require('../db/db');
const dblog = require('../db/logger');
const logger = require('../util/logger');
const xssec = require('@sap/xssec');
const xsenv = require('@sap/xsenv');

function denyBearerToken(req, res, next) {
  if (req.user !== undefined && req.user.bearer) {
    res.status(400).json({ denyAccess: 'Unauthorized' });
  } else {
    next();
  }
}

function checkACL(req, res, next) {
  if (req.user && req.user.bearer) {
    if (req.method === 'GET' && req.user.data && req.params.app_id === req.user.data.app_id.toString()) {
      next();
    } else {
      res.status(400).json({ aclAccess: 'Unauthorized' });
    }
  } else {
    next();
  }
}

function getRole(req) {
  var role = '';
  if (req.authInfo.checkLocalScope('ViewAllApps') && req.authInfo.checkLocalScope('UpdateAllApps')) {
    role = 'admin';
  } else if (req.authInfo.checkLocalScope('ViewMyApps') && req.authInfo.checkLocalScope('UpdateMyApps')) {
    role = 'app_owner';
  } else if (req.authInfo.checkLocalScope('ViewAllApps') && !req.authInfo.checkLocalScope('UpdateAllApps')) {
    role = 'view_only';
  }
  return role;
}

function validateBearerToken(token, callback) {
  // Validate Bearer token
  logger.winston.info('Auth.validateBearerToken');

  db.any('select app_id from app_tokens where token = $1', [token])
    .then((data) => {
      logger.winston.info(JSON.stringify(data));
      logger.winston.info('Bearer token validated');
      dblog.logToDB(data[0].app_id, 'sdk', 'bearer token used to access data');
      callback({ bearer: true, data: data[0] }, null);
    })
    .catch(() => {
      callback(null, false);
    });
}

function getLoggedInUser(req, res, next) {
  // Return static user for development
  if (global.asc.environment === 'dev' || global.asc.environment === 'test') {
    // Server side roles: admin, app_owner, view_only
    res.json({
      firstname: 'Dev', lastname: 'User', userId: 'G772663', email: 'dev.user@mycompany.com', role: 'admin'
    });
  } else {
    var jwt = req.header('authorization');
    jwt = jwt.substring('Bearer '.length);

    xssec.createSecurityContext(jwt, xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa, (error, securityContext) => {
      var userInfo = {};

      if (error) {
        res.json({ username: 'BearerToken' });
      }

      try {
        userInfo = {
          userId: securityContext.getLogonName(),
          firstname: securityContext.getGivenName(),
          lastname: securityContext.getFamilyName(),
          email: securityContext.getEmail(),
          role: getRole(req),
          securityContext: securityContext
        };
        res.json(userInfo);
      } catch (err) {
        res.json(err);
      }
    });
  }
}
