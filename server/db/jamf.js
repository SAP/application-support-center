module.exports = {
  postJamfAppinfo,
  postJamfAppIPA,
  putJamfAppName
};

const logger = require('../util/logger');
const request = require('request');
const apps = require('./apps');
const db = require('./db');
const notifications = require('./notifications');
const AppInfoParser = require('app-info-parser');

var multer = require('multer');
var fs = require('fs');
// const exp = require('constants');

function putJamfAppName(req, res, next) {
  logger.winston.info('Jamf.putJamfAppName');
  var sURL;
  if (req.query.system === 'prod') {
    // sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  } else if (req.query.system === 'test') {
    // sURL = 'https://' + global.asc.test_jamf_username + ':' + global.asc.test_jamf_password + '@' + global.asc.test_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  }
  if (sURL) {
    request({
      method: 'PUT',
      uri: sURL,
      timeout: 2000,
      body: '<mobile_device_application><general><name>' + req.body.app_name + '</name></general></mobile_device_application>'
    }, (error, response, body) => {
      if (error) {
        logger.winston.error(error);
        res.status(500).json('{"error" : ' + error + '}');
      } else {
        try {
          res.status(200).json({ data: body });
        } catch (err) {
          logger.winston.error(err);
          res.status(500).json('{"error" : ' + err + '}');
        }
      }
    });
  } else {
    res.status(500).json('{"error" : "No system specified" }');
  }
}

function postJamfAppinfo(req, res, next) {
  logger.winston.info('Jamf.postJamfAppinfo');
  var sURL;
  if (req.query.system === 'prod') {
    sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  } else if (req.query.system === 'test') {
    sURL = 'https://' + global.asc.test_jamf_username + ':' + global.asc.test_jamf_password + '@' + global.asc.test_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  }
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
          res.status(200).json(data);
        } catch (err) {
          logger.winston.error('Error:' + err, 'Body:' + body);
          res.status(500).json({ error: ' + err + ' });
        }
      }
    });
  } else {
    res.status(500).json('{"error" : "No system specified" }');
  }
}

// eslint-disable-next-line consistent-return
function postJamfAppIPA(req, res, next) {
  logger.winston.info('Jamf.postJamfAppIPA');

  // 1: Upload the IPA to temporary storage
  // 2: Get the App ID from Jamf
  // 3: Upload that IPA to the App ID
  try {
    var directory = global.asc.resources_dir + 'app_ipas';
    var sDate = Date.now();
    var sFilename = 'release_' + req.query.version + '_' + sDate + '.ipa';
    var ipaInfo = {};

    var storage = multer.diskStorage({
      destination: directory,
      filename: (fileReq, file, cb) => {
        cb(null, sFilename);
      }
    });

    var upload = multer({
      storage: storage
    }).single('file');

    // eslint-disable-next-line consistent-return
    upload(req, res, async (err) => {
      if (err) {
        logger.winston.error(err);
        return res.status(422).send({
          msg: err
        });
      }

      try {
        // Lets inspect the uploaded IPA, we will check the bundle ID matches the ASC Bundle ID, and also pull the info.plist data
        const parser = new AppInfoParser(req.file.path);
        ipaInfo = await parser.parse();

        // Remove to reduce unneccesary data being saved to DB
        ipaInfo.mobileProvision.DeveloperCertificates = '(Removed for storage by ASC)';
        ipaInfo.mobileProvision['DER-Encoded-Profile'] = '(Removed for storage by ASC)';
        ipaInfo.icon = '';
      } catch (parseErr) {
        console.log(parseErr);
      }

      if (ipaInfo.CFBundleIdentifier !== req.query.bundle_id) {
        res.status(400).json({ error: 'The uploaded file bundle ID does not match the Jamf Bundle ID, are you sure the file you are uploading is correct? The file was not uploaded' });
      } else if (req.file !== undefined && req.file.path !== undefined) {
        // File uploaded to temp storage OK, lets push it to Jamf
        try {
          var sURL;
          var expDate = '';
          if (req.query.system === 'prod') {
            sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/JSSResource/fileuploads/mobiledeviceapplicationsipa/id/' + req.params.jamf_app_id + '?FORCE_IPA_UPLOAD=true';
          } else if (req.query.system === 'test') {
            sURL = 'https://' + global.asc.test_jamf_username + ':' + global.asc.test_jamf_password + '@' + global.asc.test_jamf_endpoint + '/JSSResource/fileuploads/mobiledeviceapplicationsipa/id/' + req.params.jamf_app_id + '?FORCE_IPA_UPLOAD=true';
          }
          if (sURL) {
            request({
              method: 'POST',
              uri: sURL,
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              formData: {
                file: fs.createReadStream(req.file.path),
                filename: sFilename
              }
            }, (error, response, body) => {
              if (error) {
                logger.winston.error(error);
                res.status(500, '{"error" : ' + error + '}');
              }

              // Get IPA file info and add to app_releases
              try {
                db.none('update app_releases set file_metadata = $1 where release_id = $2', [req.query.system + ' upload on ' + new Date() + '\n\n' + JSON.stringify(ipaInfo), req.query.release_id]);
                if (ipaInfo && ipaInfo.mobileProvision && ipaInfo.mobileProvision.ExpirationDate) {
                  expDate = ipaInfo.mobileProvision.ExpirationDate;
                  if (req.query.system === 'prod') {
                    db.none('update apps set expiration_date = $1 where app_id = $2', [expDate, req.query.app_id]);
                  }
                  // notifications.sendDebugEmail('New upload to ' + req.query.system + '. Prov Profile exp date: ' + expDate + ' - metadata ' + JSON.stringify(ipaInfo));
                } else {
                  // notifications.sendDebugEmail('New upload to ' + req.query.system + '. Prov Profile exp date: Unknown - metadata ' + JSON.stringify(ipaInfo));
                }
              } catch (dbUpdateErr) {
                logger.winston.error(dbUpdateErr);
                console.log(dbUpdateErr);
              }

              try {
                notifications.sendNotifications(req.query.release_id, req.query.system, expDate);
              } catch (err1) {
                console.log('Unable to post to slack: ' + err1);
              }

              try {
                // Success
                var uploadResponse = {
                  body: body,
                  expiration_date: expDate
                };
                res.status(200).json(uploadResponse);
              } catch (bodyErr) {
                logger.winston.error(bodyErr);
                res.status(500, res, '{"error" : ' + bodyErr + '}');
              }
            });
          } else {
            return res.status(500).json({ error: 'No system specified' });
          }
        } catch (uploadErr) {
          return res.status(400).json({ error: 'Unable to upload to Jamf' });
        }
      } else {
        return res.status(400).json({ error: 'failed upload to local temp storage' });
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
}
