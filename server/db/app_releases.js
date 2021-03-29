module.exports = {
  getSingleAppRelease,
  getAllAppReleases,
  createAppRelease,
  updateAppRelease,
  removeAppRelease
};

const db = require('./db');
const apps = require('./apps');
const logger = require('../util/logger');

function getAllAppReleases(req, res, next) {
  logger.winston.info('Releases.getAllAppReleases');
  db.any('select * from app_releases where app_id = $1 order by release_date desc NULLS LAST', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppRelease(req, res, next) {
  logger.winston.info('Releases.createAppRelease');

  db.one('insert into app_releases(version, release_date, description, visible, app_id) values ($1, $2, $3, $4, $5) returning *', [req.body.version, req.body.release_date, req.body.description, req.body.visible, req.params.app_id])
    .then((data) => {
      apps.updateContentVersion(req.params.app_id);
      apps.sendNotifications(data.release_id);
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: data.release_id, data: data
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getSingleAppRelease(req, res, next) {
  logger.winston.info('Releases.getSingleAppRelease');

  db.one('select * from app_releases where release_id = $1', req.params.release_id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function updateAppRelease(req, res, next) {
  logger.winston.info('Releases.updateAppRelease');

  db.none('update app_releases set version = $1, release_date = $2, description = $3, visible = $4 where release_id = $5', [req.body.version, req.body.release_date, req.body.description, req.body.visible, req.params.release_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppRelease(req, res, next) {
  logger.winston.info('Releases.removeAppRelease');

  db.none('delete from app_releases where release_id = $1', req.params.release_id)
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
