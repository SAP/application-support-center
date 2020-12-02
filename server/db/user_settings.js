module.exports = {
  getAllUserSettings,
  createUserSetting,
  updateUserSetting,
  removeUserSetting
};

const db = require('./db');
const logger = require('../util/logger');

function getAllUserSettings(req, res, next) {
  logger.winston.info('Settings.getAllUserSettings');
  db.any('select * from user_settings where external_id = $1', req.params.external_id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createUserSetting(req, res, next) {
  logger.winston.info('UserSettings.createUserSetting');

  db.one('insert into user_settings (external_id, setting_name, setting_value) values ($1, $2, $3) returning *', [req.body.external_id, req.body.setting_name, req.body.setting_value])
    .then((data) => {
      res.status(201).json({ status: 'success', message: 'Inserted', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateUserSetting(req, res, next) {
  logger.winston.info('UserSettings.updateUserSetting');

  db.none('update user_settings set setting_name = $1, setting_value = $2 where external_id = $3', [req.params.setting_name, req.body.setting_value, req.params.external_id])
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeUserSetting(req, res, next) {
  logger.winston.info('UserSettings.removeUserSetting');

  db.none('delete from user_settings where setting_name = $1 and external_id = $2', [req.params.setting_name, req.params.external_id])
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
