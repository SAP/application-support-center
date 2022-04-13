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
  } else if (req.query.report_id === 'app_contacts') {
    sSQL = `select app_name, first_name, last_name, email 
    from apps inner join app_contacts on apps.app_id = app_contacts.app_id 
    inner join contacts c on app_contacts.contact_id = c.contact_id
    order by app_name`;
    aColNames = [{ columnName: 'app_name' },
      { columnName: 'first_name' },
      { columnName: 'last_name' },
      { columnName: 'email' }
    ];
  } else if (req.query.report_id === 'app_releases') {
    sSQL = `select to_char(release_date, 'MM/DD/YYYY') as date, app_name, technology, regexp_replace(description, E'<[^>]+>', '', 'gi') as description
    from app_releases inner join apps using (app_id) order by release_date desc limit 100`;
    aColNames = [{ columnName: 'date' },
      { columnName: 'app_name' },
      { columnName: 'technology' },
      { columnName: 'description' }
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
