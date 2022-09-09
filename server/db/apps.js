module.exports = {
  getSingleApp,
  getAllApps,
  getMyApps,
  createApp,
  updateApp,
  removeApp,
  getSecureTokenForApp,
  createAppIcon,
  updateContentVersion,
  getTrackingData,
  updateAppSyncIcon,
  replaceSecureTokenForApp,
  getSingleAppBulkData,
  getAppIcon
};

const db = require('./db');
const multer = require('multer');
const mime = require('mime');
const logger = require('../util/logger');
const fs = require('fs');

function getAppIcon(req, res, next) {
  logger.winston.info('Apps.getAppIcon');
  try {
    var filename = global.asc.resources_dir + '/app_icons/' + req.params.app_id + '.png';
    if (global.asc.environment === 'dev' || global.asc.environment === 'test') {
      res.sendFile(filename, { root: '.' });
    } else {
      res.sendFile(filename);
    }
  } catch (err) {
    logger.winston.error(err);
    res.status(400).json({ data: 'Error getting file' });
  }
}

function getAllApps(req, res, next) {
  logger.winston.info('Apps.getAllApps');

  var select = `select *, to_char(apps.go_live, 'MM/DD/YYYY') as go_live,
   to_char(apps.created, 'MM/DD/YYYY') as created,
   to_char(apps.modified, 'MM/DD/YYYY') as modified,
   to_char(apps.retired, 'MM/DD/YYYY') as retired,
   (select COALESCE(STRING_AGG(keyword, ','), 'NONE_FOUND') as app_keywords from app_keywords where app_keywords.app_id = apps.app_id)
   from apps where 1 = 1 `;
  if (req.query.category) {
    select = select + " and category = '" + req.query.category + "' ";
  }
  select += ' order by app_id desc';

  db.any(select)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error('getAllApps: ' + err);
      res.status(400).json({ data: err });
    });
}

function getMyApps(req, res, next) {
  logger.winston.info('Apps.getMyApps');

  db.any(`select distinct apps.*, to_char(apps.go_live, 'MM/DD/YYYY') as go_live,
    to_char(apps.created, 'MM/DD/YYYY') as created, to_char(apps.modified, 'MM/DD/YYYY') as modified, 
    to_char(apps.retired, 'MM/DD/YYYY') as retired from apps inner join app_contacts ac on apps.app_id = ac.app_id 
    inner join contacts c on ac.contact_id = c.contact_id where c.external_id = $1`, [req.query.externalId])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error('getMyApps: ' + err);
      res.status(400).json({ data: err });
    });
}

function createApp(req, res, next) {
  logger.winston.info('Apps.createApp');

  db.one(`insert into apps(
    app_name,
    category,
    status,
    modified,
    notes,
    monitoring_url,
    go_live,
    retired,
    usage_tracking_id,
    technology,
    jamf_id,
    bundle_id,
    feedback_service_id,
    git_url
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning app_id`, [
    req.body.app_name,
    req.body.category,
    req.body.status,
    req.body.modified,
    req.body.notes,
    req.body.monitoring_url,
    req.body.go_live,
    req.body.retired,
    req.body.usage_tracking_id,
    req.body.technology,
    req.body.jamf_id,
    req.body.bundle_id,
    req.body.feedback_service_id,
    req.body.git_url
  ])
    .then((data) => {
      db.one('select * from apps where app_id = $1', [data.app_id])
        .then((newRow) => {
          addSecureTokenForApp(newRow.app_id);
          res.status(201).json({
            status: 'success', message: 'Inserted', lastID: data.app_id, data: newRow
          });
        });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getSingleApp(req, res, next) {
  logger.winston.info('Apps.getSingleApp');

  db.one('select * from apps where app_id = $1', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function updateApp(req, res, next) {
  logger.winston.info('Apps.updateApp');
  db.any(
    `update apps set 
    app_name = $1,
    category = $2,
    status = $3,
    modified = now(),
    notes = $4,
    monitoring_url = $5,
    go_live = $6,
    retired = $7,
    usage_tracking_id = $8,
    technology = $9,
    jamf_id = $10,
    bundle_id = $11,
    content_id = now(),
    feedback_service_id = $13,
    git_url = $14,
    expiration_date = $15,
    feedback_type = $16,
    feedback_info_type = $17,
    feedback_start_date = $18,
    feedback_end_date = $19,
    feedback_repeat_days = $20,
    feedback_repeat_on = $21,
    feedback_status = $22
    where app_id = $12`,
    [
      req.body.app_name,
      req.body.category,
      req.body.status,
      req.body.notes,
      req.body.monitoring_url,
      req.body.go_live || null,
      req.body.retired || null,
      req.body.usage_tracking_id,
      req.body.technology,
      req.body.jamf_id,
      req.body.bundle_id,
      req.params.app_id,
      req.body.feedback_service_id,
      req.body.git_url,
      req.body.expiration_date,
      req.body.feedback_type,
      req.body.feedback_info_type,
      req.body.feedback_start_date || null,
      req.body.feedback_end_date || null,
      req.body.feedback_repeat_days,
      req.body.feedback_repeat_on,
      req.body.feedback_status === 'Active' ? 1 : 0
    ]
  )
    .then((data) => {
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeApp(req, res, next) {
  logger.winston.info('Apps.removeApp');
  db.none('delete from apps where app_id = $1', [req.params.app_id])
    .then((data) => {
      res.status(200).json({ status: 'success', message: 'Removed', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record');
      res.status(400).json({ data: err });
    });
}

// Secure App Token functionality

function replaceSecureTokenForApp(req, res, next) {
  var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  db.none('delete from app_tokens where app_id = $1', [req.params.app_id]);
  db.any('insert into app_tokens (app_id, token) values ($1, $2)', [req.params.app_id, token])
    .then(() => {
      res.status(200).json([{ token: token }]);
    }).catch((err) => {
      logger.winston.error('Error refreshing the token');
      res.status(400).json({ data: err });
    });
}

function addSecureTokenForApp(appId) {
  var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  db.any('insert into app_tokens (app_id, token) values ($1, $2)', [appId, token])
    .then(() => {
      logger.winston.error('Secure token added for the app');
    });
}

function getSecureTokenForApp(req, res, next) {
  // Check that the user making the request is allowed to request it && user is logged in
  logger.winston.info('Apps.getSecureTokenForApp');
  db.any('select token from app_tokens where app_id = $1', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

// App Icon functionality
function createAppIcon(req, res, next) {
  logger.winston.info('Apps.createAppIcon');
  try {
    var directory = global.asc.resources_dir + '/app_icons';

    var storage = multer.diskStorage({
      destination: directory,
      filename: (fileReq, file, cb) => {
        cb(null, req.params.app_id + '.' + mime.getExtension(file.mimetype).toLowerCase());
      }
    });

    var upload = multer({
      storage: storage
    }).single('file');

    upload(req, res, (err) => {
      if (err) {
        logger.winston.error(err);
        return res.status(422).send({
          msg: err
        });
      }

      var path = '';
      if (req.file !== undefined && req.file.path !== undefined) {
        path = req.file.path;
        return res.status(201).json({ icon_path: path });
      }
      return res.status(400).json({ error: 'failed upload' });
    });
  } catch (err) {
    logger.winston.error(err);
  }
}

function updateContentVersion(appId) {
  logger.winston.info('Apps.updateContentVersion');
  db.none('update apps set content_id = now() where app_id = $1', [appId])
    .catch((err) => {
      logger.winston.error('Error updating the content version: ' + err);
    });
}

var download = (iconUrl, filename, callback) => {
  request.head(iconUrl, () => {
    request(iconUrl).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function updateAppSyncIcon(req, res, next) {
  try {
    var sURL;
    sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.query.bundle_id;
    if (sURL) {
      request({
        method: 'GET',
        uri: sURL,
        timeout: 2000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }, (error, response, body) => {
        if (error) {
          logger.winston.error(error);
          res.status(500).json('{"error" : ' + error + '}');
        } else {
          try {
            var data = JSON.parse(body);
            var iconUrl = data.mobile_device_application.general.icon.uri;
            var directory = global.asc.resources_dir + '/app_icons';

            download(iconUrl, directory + '/' + req.params.app_id + '.png', () => {
              res.status(200).json('Synced');
            });
          } catch (err) {
            logger.winston.error(err);
            res.status(500).json('{"error" : ' + err + '}');
          }
        }
      });
    } else {
      res.status(500).json('{"error" : "No system specified" }');
    }
  } catch (err) {
    logger.winston.error(err);
  }
}

// Get App Usage Stats
function formatDate(date) {
  // Returns a date formatted for the API Query "2020-08-30";
  var d = new Date(date);
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function getSingleAppBulkData(req, res, next) {
  logger.winston.info('Apps.getSingleAppBulkData');
  var oData = {};
  db.task('grouped-activity', t => {
    return t.batch([
      t.any('select * from app_help where app_id = $1 order by help_id desc', [req.params.app_id]),
      t.any('select * from app_announcements where app_id = $1 and visible = true order by announcement_id desc', [req.params.app_id]),
      t.any('select * from app_releases where app_id = $1 order by release_date desc NULLS LAST', [req.params.app_id]),
      t.any('select * from contacts inner join app_contacts on contacts.contact_id = app_contacts.contact_id where app_id = $1', [req.params.app_id])
    ]);
  })
    .then((data) => {
      oData.help = data[0];
      oData.announcements = data[1];
      oData.releases = data[2];
      oData.contacts = data[3];
      res.status(200).json(oData);
    });
}

// SAP Specific Code
function getTrackingData(req, res, next) {
  try {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 3, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var startDate = formatDate(firstDay);
    var endDate = formatDate(lastDay);
    var trackingId = req.query.tracking_id;

    var sURL;
    sURL = global.asc.usage_stats_url + trackingId + '?start=' + startDate + '&end=' + endDate + '&interval=MONTH';

    if (sURL) {
      request({
        method: 'GET',
        uri: sURL,
        timeout: 10000,
        headers: {
          Authorization: 'Bearer ' + global.asc.tracking_bearer_token,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }, (error, response, body) => {
        if (error) {
          logger.winston.error(error);
          res.status(500).json('{"error" : ' + error + '}');
        } else {
          try {
            var data = JSON.parse(body);
            res.status(200).json(data);
          } catch (err) {
            logger.winston.error(err);
            res.status(500).json('{"error" : ' + err + '}');
          }
        }
      });
    } else {
      res.status(500).json('{"error" : "URL Error" }');
    }
  } catch (error) {
    res.status(500).json('{"error" : ' + error + ' }');
  }
}
// SAP Specific Code
