module.exports = {
  getAllStats
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
      t.any('select * from apps order by go_live DESC NULLS LAST LIMIT 5'),
      t.any('select to_char(release_date,\'YY-MM\') as dt, count(app_id) from apps inner join app_releases using (app_id) where app_releases.release_date > now() -  INTERVAL \'365 DAY\' group by 1 order by 1')
    ]);
  })
    .then((data) => {
      oData.new_apps = data[0];
      oData.recent_releases = data[1];
      oData.recent_golive = data[2];
      oData.releases_bymonth = data[3];
      res.status(200).json(oData);
    });
}
