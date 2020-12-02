module.exports = {
  getAllAppKeywords,
  createAppKeyword,
  updateAppKeyword,
  removeAppKeyword
};

const db = require('./db');
const logger = require('../util/logger');

function getAllAppKeywords(req, res, next) {
  logger.winston.info('App_Keywords.getAllAppKeywords');
  db.any('select * from app_keywords inner join settings on app_keywords.keyword = settings.setting_key where app_id = $1 order by keyword, description', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppKeyword(req, res, next) {
  logger.winston.info('App_Keywords.createAppKeyword');

  db.one('insert into app_keywords(keyword, description, app_id) values ($1, $2, $3) returning *', [req.body.keyword, req.body.description, req.params.app_id])
    .then((data) => {
      db.one('select * from app_keywords inner join settings on app_keywords.keyword = settings.setting_key where keyword_id = $1', [data.keyword_id])
        .then((newKeyword) => {
          res.status(201).json({
            status: 'success', message: 'Inserted', lastID: data.keyword_id, data: newKeyword
          });
        });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateAppKeyword(req, res, next) {
  logger.winston.info('App_Keyword.updateAppKeyword');

  db.none('update app_keywords set keyword = $1, description = $2 where keyword_id = $3', [req.body.keyword, req.body.description, req.params.keyword_id])
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppKeyword(req, res, next) {
  logger.winston.info('App_Keyword.removeAppKeyword');

  db.none('delete from app_keywords where keyword_id = $1', req.params.keyword_id)
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
