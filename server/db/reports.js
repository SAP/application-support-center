module.exports = {
  getReportData
};

const db = require('./db');
const logger = require('../util/logger');

function getReportData(req, res, next) {
  logger.winston.info('Report.getReportData');
  var sSQL = '';
  var aColNames = [];
  var aColLabels = [];
  if (req.query.report_id === 'all_apps') {
    sSQL = `select app_id, app_name, category, status, to_char(apps.go_live, 'MM/DD/YYYY') as go_live,
    to_char(apps.created, 'MM/DD/YYYY') as created,
    to_char(apps.modified, 'MM/DD/YYYY') as modified,
    to_char(apps.retired, 'MM/DD/YYYY') as retired,
    technology, bundle_id,
    (select STRING_AGG(keyword || ': ' || description, '; ') as app_keywords from app_keywords where app_keywords.app_id = apps.app_id)
    from apps`;
    aColNames = [{ columnName: 'app_id' },
      { columnName: 'app_name' },
      { columnName: 'category' },
      { columnName: 'status' },
      { columnName: 'go_live' },
      { columnName: 'created' },
      { columnName: 'modified' },
      { columnName: 'retired' },
      { columnName: 'modified' },
      { columnName: 'technology' },
      { columnName: 'bundle_id' },
      { columnName: 'app_keywords' }
    ];
  }

  if (sSQL !== '') {
    db.any(sSQL)
      .then((data) => {
        res.status(200).json({ rows: data, columns: aColNames, labels: aColLabels });
      })
      .catch((err) => {
        res.status(400).json({ data: err });
      });
  } else {
    res.status(400).json();
  }
}
