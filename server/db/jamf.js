module.exports = {
  postJamfAppinfo,
  postJamfAppIPA,
  putJamfAppName
};

const logger = require('../util/logger');
const request = require('request');
var multer = require('multer');
var fs = require('fs');

function putJamfAppName(req, res, next) {
  logger.winston.info('Jamf.putJamfAppName');
  var sURL;
  if (req.query.system === 'prod') {
    sURL = 'https://' + global.asc.prod_jamf_username + ':' + global.asc.prod_jamf_password + '@' + global.asc.prod_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
  } else if (req.query.system === 'test') {
    sURL = 'https://' + global.asc.test_jamf_username + ':' + global.asc.test_jamf_password + '@' + global.asc.test_jamf_endpoint + '/JSSResource/mobiledeviceapplications/bundleid/' + req.params.bundle_id;
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
    upload(req, res, (err) => {
      if (err) {
        logger.winston.error(err);
        return res.status(422).send({
          msg: err
        });
      }

      if (req.file !== undefined && req.file.path !== undefined) {
        // File uploaded to temp storage OK, lets push it to Jamf
        try {
          var sURL;
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
              try {
                res.status(200).json(body);
              } catch (bodyErr) {
                logger.winston.error(bodyErr);
                res.status(500, res, '{"error" : ' + bodyErr + '}');
              }
            });
          } else {
            return res.status(500).json('{"error" : "No system specified" }');
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
