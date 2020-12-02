module.exports = {
  getAllNotifications,
  createNotification,
  updateNotitifcation,
  removeNotification
};

const db = require('./db');
const logger = require('../util/logger');

function getAllNotifications(req, res, next) {
  logger.winston.info('Notifications.getAllNotifications');
  db.any('select notification_id, to_char(notification_date, \'MM/DD/YYYY\') as notification_date, notification_text from notifications order by notification_date desc')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createNotification(req, res, next) {
  logger.winston.info('Notifications.createNotification');

  db.one('insert into notifications(notification_date, notification_text) values ($1, $2) returning *', [req.body.notification_date, req.body.notification_text])
    .then((data) => {
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: data.notification_id, data: data
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateNotitifcation(req, res, next) {
  logger.winston.info('Announcements.updateAppAnnouncements');

  db.none('update notifications set notification_date = $1, notification_text = $2 where notification_id = $3', [req.body.notification_date, req.body.notification_text, req.params.notification_id])
    .then((data) => {
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeNotification(req, res, next) {
  logger.winston.info('Notifications.removeNotification');

  db.none('delete from notifications where notification_id = $1', req.params.notification_id)
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
