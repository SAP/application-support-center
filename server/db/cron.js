module.exports = {
  runJobCheck,
  checkForExpiringApps
};

const db = require('./db');
const notifications = require('./notifications');
var cron = require('cron').CronJob;

function runJobCheck() {
  var period;
  if (global.asc.environment === 'dev') {
    period = '0 */1 * * * *';
  } else {
    period = '00 00 00 * * *';
  }
  const job = new cron(period, function () {
    const d = new Date();
    console.log('Cron check', d);
    checkForExpiringApps();
  });
  job.start();
}

function checkForExpiringApps() {
  db.any(`
  select apps.app_id, app_name, DATE_PART('day', expiration_date - now()) as days, to_char(expiration_date, 'MM/DD/YYYY') as expiration_date, string_agg(email, ';') as emails, string_agg(first_name, ', ') as names
  from apps
      inner join app_contacts on apps.app_id = app_contacts.app_id
  inner join contacts on app_contacts.contact_id = contacts.contact_id
  where expiration_date is not null
    --and DATE_PART('day', expiration_date - now()) < 30
  group by apps.app_id, app_name, expiration_date`)
    .then((data) => {
      data.forEach(record => {
        notifications.sendEmail(record.emails, record.app_id, record.app_name, record.expiration_date, record.days, record.names);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
