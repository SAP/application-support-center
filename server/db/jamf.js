module.exports = {
  postJamfAppinfo,
  postJamfAppIPA,
  putJamfAppName,
  postJamfAuthToken
};

const logger = require('../util/logger');
const request = require('request');
const db = require('./db');
const notifications = require('./notifications');
const PkgReader = require('reiko-parser');

const axios = require('axios');
var multer = require('multer');
var fs = require('fs');

async function postJamfAuthToken(system) {
  logger.winston.info('Jamf.postJamfAuthToken');
  var sURL;
  if (system === 'prod') {
    sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/api/v1/auth/token';
  } else if (system === 'test') {
    sURL = 'https://' + global.asc.test_jamf_endpoint + '/api/v1/auth/token';
  }
  if (sURL) {
    try {
      const response = await axios(sURL, {
        method: 'POST',
        timeout: 2000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${btoa(`${global.asc.test_jamf_username}:${global.asc.test_jamf_password}`)}`
        }
      });
      const data = await response.data;
      return data.token;
    } catch (err) {
      console.log(err);
    }
  }
}

async function putJamfAppName(req, res, next) {
  logger.winston.info('Jamf.putJamfAppName');
  var sURL;
  if (req.query.system === 'prod') {
    sURL = 'https://' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  } else if (req.query.system === 'test') {
    sURL = 'https://' + global.asc.test_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  }
  const jamfAuthToken = await postJamfAuthToken(req.query.system);

  if (sURL) {
    await axios(sURL, {
      method: 'PUT',
      timeout: 2000,
      Authorization: 'Bearer ' + jamfAuthToken,
      body: '<mobile_device_application><general><name>' + req.body.app_name + '</name></general></mobile_device_application>'
    }).then(function (response) {
      try {
        res.status(200).json(response.data);
      } catch (err) {
        logger.winston.error(err);
        res.status(500).json('{"error" : ' + err + '}');
      }
    });
  } else {
    res.status(500).json('{"error" : "No system specified" }');
  }
}

async function postJamfAppinfo(req, res, next) {
  logger.winston.info('Jamf.postJamfAppinfo');
  var sURL;
  if (req.query.system === 'prod') {
    sURL = 'https://' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  } else if (req.query.system === 'test') {
    sURL = 'https://' + global.asc.test_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  }

  const jamfAuthToken = await postJamfAuthToken(req.query.system);

  if (sURL) {
    try {
      await axios(sURL, {
        method: 'GET',
        timeout: 2000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + jamfAuthToken
        }
      }).then(function (response) {
        try {
          res.status(200).json(response.data);
        } catch (err) {
          logger.winston.error('Error:' + err, 'Body:' + response);
          res.status(500).json({ error: err });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}

// eslint-disable-next-line consistent-return
async function postJamfAppIPA(req, res, next) {
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

    const jamfAuthToken = await postJamfAuthToken(req.query.system);

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
        ipaInfo = await new Promise((resolve, reject) => {
          const reader = new PkgReader(req.file.path, 'ipa', { withIcon: false });
          reader.parse((error, pkgInfo) => {
            if (err) {
              reject(err);
            } else {
              resolve(pkgInfo);
            }
          });
        });

        ipaInfo.mobileProvision.DeveloperCertificates = '(Removed for storage by ASC)';
        ipaInfo.mobileProvision['DER-Encoded-Profile'] = '(Removed for storage by ASC)';
        ipaInfo.icon = '';
      } catch (parseErr) {
        console.log(parseErr);
      }

      if (ipaInfo.CFBundleIdentifier !== req.query.bundle_id && ipaInfo.WKCompanionAppBundleIdentifier !== req.query.bundle_id) {
        res.status(400).json({ error: 'The uploaded file bundle ID does not match the Jamf Bundle ID, are you sure the file you are uploading is correct? The file was not uploaded' });
      } else if (req.file !== undefined && req.file.path !== undefined) {
        // File uploaded to temp storage OK, lets push it to Jamf
        try {
          var sURL;
          var expDate = '';
          var oData;

          if (req.query.system === 'prod') {
            sURL = 'https://' + global.asc.prod_jamf_endpoint + '/JSSResource/fileuploads/mobiledeviceapplicationsipa/id/' + req.params.jamf_app_id + '?FORCE_IPA_UPLOAD=true';
            oData = {
              file: fs.createReadStream(req.file.path)
            };
          } else if (req.query.system === 'test') {
            sURL = 'https://' + global.asc.test_jamf_endpoint + '/JSSResource/fileuploads/mobiledeviceapplicationsipa/id/' + req.params.jamf_app_id + '?FORCE_IPA_UPLOAD=true';
            oData = {
              file: fs.createReadStream(req.file.path)
            };
          }
          if (sURL) {
            await axios(sURL, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + jamfAuthToken,
                'Content-Type': 'multipart/form-data'
              },
              data: oData
            }).then(function (response) {
              // Success

              // Get IPA file info and add to app_releases
              try {
                db.none('update app_releases set file_metadata = $1 where release_id = $2', [req.query.system + ' upload on ' + new Date() + '\n\n' + JSON.stringify(ipaInfo), req.query.release_id]);
                if (ipaInfo && ipaInfo.mobileProvision && ipaInfo.mobileProvision.ExpirationDate) {
                  expDate = ipaInfo.mobileProvision.ExpirationDate;
                  if (req.query.system === 'prod') {
                    db.none('update apps set expiration_date = $1 where app_id = $2', [expDate, req.query.app_id]);
                  }
                }
              } catch (dbUpdateErr) {
                logger.winston.error(dbUpdateErr);
                console.log(dbUpdateErr);
              }

              try {
                console.log(req.query.user);
                notifications.sendNotifications(req.query.release_id, req.query.system, expDate, req.query.user);
              } catch (err1) {
                console.log('Unable to post to slack: ' + err1);
              }

              try {
                // Success
                var uploadResponse = {
                  body: response.body,
                  expiration_date: expDate
                };
                res.status(200).json(uploadResponse);
              } catch (bodyErr) {
                logger.winston.error(bodyErr);
                res.status(500).json({ error: bodyErr });
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
