module.exports = {
  getSingleAppAnnouncement,
  getAllAppAnnouncements,
  createAppAnnouncement,
  updateAppAnnouncement,
  removeAppAnnouncement
};

const db = require('./db');
const apps = require('./apps');
const logger = require('../util/logger');

function getAllAppAnnouncements(req, res, next) {
  logger.winston.info('Announcements.getAllAppAnnouncements');
  db.any('select * from app_announcements where app_id = $1 order by announcement_id desc', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppAnnouncement(req, res, next) {
  logger.winston.info('Announcements.createAppAnnouncements');

  db.one('insert into app_announcements(title, description, app_id, sort_order, visible) values ($1, $2, $3, $4, $5) returning announcement_id', [req.body.title, req.body.description, req.params.app_id, req.body.sort_order, req.body.visible])
    .then((data) => {
      apps.updateContentVersion(req.params.app_id);
      db.one('select * from app_announcements where announcement_id = $1', data.announcement_id)
        .then((newRow) => {
          res.status(201).json({
            status: 'success', message: 'Inserted', lastID: data.announcement_id, data: newRow
          });
        });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getSingleAppAnnouncement(req, res, next) {
  logger.winston.info('Announcements.getSingleAppAnnouncement');

  db.one('select * from app_announcements where announcement_id = $1', req.params.announcement_id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function updateAppAnnouncement(req, res, next) {
  logger.winston.info('Announcements.updateAppAnnouncements');

  db.none('update app_announcements set title = $1, description = $2, sort_order = $3, visible = $4 where announcement_id = $5', [req.body.title, req.body.description, req.body.sort_order, req.body.visible, req.params.announcement_id])
    .then((data) => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppAnnouncement(req, res, next) {
  logger.winston.info('Announcements.removeAppAnnouncements');

  db.none('delete from app_announcements where announcement_id = $1', [req.params.announcement_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
