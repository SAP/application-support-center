module.exports = {
  getAllStats,
  getAllReleases
};

const db = require('./db');
const logger = require('../util/logger');

function getAllStats(req, res, next) {
  logger.winston.info('Dashboard.getNewApps');
  var oData = {};
  db.task('grouped-activity', t => {
    return t.batch([
      t.any('select * from apps where created > now() -  INTERVAL \'30 DAY\' order by created DESC LIMIT 5'),
      t.any('select * from apps inner join app_releases using (app_id) where app_releases.created > now() -  INTERVAL \'60 DAY\' order by app_releases.created DESC  LIMIT 5'),
      t.any('select * from apps where go_live is not null order by go_live DESC LIMIT 5'),
      t.any('select to_char(release_date,\'YY-MM\') as dt, count(app_id) from apps inner join app_releases using (app_id) where app_releases.release_date > now() -  INTERVAL \'365 DAY\' group by 1 order by 1'),
      t.any('select count(app_id), to_char(release_date,\'YYYY\') from apps inner join app_releases using (app_id) group by to_char(release_date,\'YYYY\') order by to_char(release_date,\'YYYY\') desc')
    ]);
  })
    .then((data) => {
      oData.new_apps = data[0];
      oData.recent_releases = data[1];
      oData.recent_golive = data[2];
      oData.releases_bymonth = data[3];
      oData.deployments_by_year = data[4];
      res.status(200).json(oData);
    });
}

function getAllReleases(req, res, next) {
  logger.winston.info('Dashboard.getAllReleases');
  db.any('select app_name, status, category, technology, version, release_date, app_id, bundle_id, expiration_date from apps inner join app_releases using (app_id) order by release_date desc limit 100')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error('getAllReleases: ' + err);
      res.status(400).json({ data: err });
    });
}
