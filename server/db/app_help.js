module.exports = {
  getSingleAppHelp,
  getAllAppHelp,
  createAppHelp,
  updateAppHelp,
  removeAppHelp
};

const db = require('./db');
const apps = require('./apps');
const logger = require('../util/logger');

function getAllAppHelp(req, res, next) {
  logger.winston.info('App_Help.getAllAppHelp');
  db.any('select * from app_help where app_id = $1 order by help_id desc', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppHelp(req, res, next) {
  logger.winston.info('App_Help.createAppHelp');

  db.one('insert into app_help(title, description, app_id, sort_order, visible) values ($1, $2, $3, $4, $5) returning *', [req.body.title, req.body.description, req.params.app_id, req.body.sort_order, req.body.visible])
    .then((newRow) => {
      apps.updateContentVersion(req.params.app_id);
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: newRow.help_id, data: newRow
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getSingleAppHelp(req, res, next) {
  logger.winston.info('App_Help.getSingleAppHelp');

  db.one('select * from app_help where help_id = $1', [req.params.help_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function updateAppHelp(req, res, next) {
  logger.winston.info('App_Help.updateAppHelp');

  db.none('update app_help set title = $1, sort_order = $2, description = $3, visible = $4 where help_id = $5', [req.body.title, req.body.sort_order, req.body.description, req.body.visible, req.params.help_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppHelp(req, res, next) {
  logger.winston.info('App_Help.removeAppHelp');

  db.none('delete from app_help where help_id = $1', req.params.help_id)
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
