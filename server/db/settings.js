module.exports = {
  getAllSettings,
  getSingleSetting,
  createSetting,
  updateSetting,
  removeSetting
};

const db = require('./db');
const logger = require('../util/logger');

function getAllSettings(req, res, next) {
  logger.winston.info('Settings.getAllSettings');
  db.any('select * from settings order by setting_name, setting_value')
    .then((data) => {
      data.push({
        setting_id: 999, setting_name: 'app_keywords', setting_key: 'NONE_FOUND', setting_value: 'No keywords specified'
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function getSingleSetting(req, res, next) {
  logger.winston.info('Settings.getSingleSetting');

  db.any('select * from settings where setting_name = $1', req.params.setting_name)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function createSetting(req, res, next) {
  logger.winston.info('Settings.createSetting');

  db.one('insert into settings(setting_name, setting_value, setting_key) values ($1, $2, $3) returning *', [req.body.setting_name, req.body.setting_value, req.body.setting_key])
    .then((data) => {
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: data.setting_id, data: data
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateSetting(req, res, next) {
  logger.winston.info('Settings.updateSetting');

  db.none('update settings set setting_name = $1, setting_value = $2, setting_key = $3 where setting_id = $4', [req.body.setting_name, req.body.setting_value, req.body.setting_key, req.params.setting_id])
    .then((data) => {
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeSetting(req, res, next) {
  logger.winston.info('Settings.removeSetting');

  db.none('delete from settings where setting_id = $1', req.params.setting_id)
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
