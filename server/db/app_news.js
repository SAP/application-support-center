module.exports = {
  getSingleAppNews,
  getAllAppNews,
  createAppNews,
  updateAppNews,
  removeAppNews
};

const db = require('./db');
const apps = require('./apps');
const logger = require('../util/logger');

function getAllAppNews(req, res, next) {
  logger.winston.info('News.getAllAppNews');
  db.any('select * from app_news where app_id = $1 order by news_id desc', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppNews(req, res, next) {
  logger.winston.info('News.createAppNews');

  db.one('insert into app_news(title, description, app_id, sort_order, version) values ($1, $2, $3, $4, $5) returning news_id', [req.body.title, req.body.description, req.params.app_id, req.body.sort_order, req.body.version])
    .then((data) => {
      apps.updateContentVersion(req.params.app_id);
      db.one('select * from app_news where news_id = $1', data.news_id)
        .then((newRow) => {
          res.status(201).json({
            status: 'success', message: 'Inserted', lastID: data.news_id, data: newRow
          });
        });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getSingleAppNews(req, res, next) {
  logger.winston.info('News.getSingleAppNews');

  db.one('select * from app_news where news_id = $1', req.params.news_id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error(err);
      res.status(400).json({ data: err });
    });
}

function updateAppNews(req, res, next) {
  logger.winston.info('News.updateAppNews');

  db.none('update app_news set title = $1, description = $2, sort_order = $3, version = $4 where news_id = $5', [req.body.title, req.body.description, req.body.sort_order, req.body.version, req.params.news_id])
    .then((data) => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppNews(req, res, next) {
  logger.winston.info('News.removeAppNews');

  db.none('delete from app_news where news_id = $1', [req.params.news_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
