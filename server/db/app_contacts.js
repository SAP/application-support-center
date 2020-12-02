module.exports = {
  getAllAppContacts,
  createAppContact,
  updateAppContact,
  removeAppContact,
  getAllAppContactsDownload,
  getAllContactsDownload
};

const db = require('./db');
const apps = require('./apps');
const logger = require('../util/logger');

function getAllAppContacts(req, res, next) {
  logger.winston.info('Contacts.getAllAppContacts');
  db.any('select * from contacts inner join app_contacts on contacts.contact_id = app_contacts.contact_id where app_id = $1', [req.params.app_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function getAllAppContactsDownload(req, res, next) {
  logger.winston.info('Contacts.getAllAppContactsDownload');
  db.any('select distinct apps.app_id, app_name, status, technology, external_id, first_name, last_name, email, role from contacts inner join app_contacts on contacts.contact_id = app_contacts.contact_id inner join apps on apps.app_id = app_contacts.app_id order by app_name, technology, last_name')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function getAllContactsDownload(req, res, next) {
  logger.winston.info('Contacts.getAllContactsDownload');
  db.any('select distinct external_id, first_name, last_name, email, created from contacts inner join app_contacts on contacts.contact_id = app_contacts.contact_id where app_contacts.role = $1', [req.query.role])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createAppContact(req, res, next) {
  logger.winston.info('Contacts.createAppContact');
  db.none('insert into app_contacts(app_id, contact_id, role) values ($1, $2, $3)', [req.params.app_id, req.body.contact_id, req.body.role])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      db.any('select * from contacts inner join app_contacts on contacts.contact_id = app_contacts.contact_id where app_id = $1', [req.params.app_id])
        .then((appContacts) => {
          res.status(201).json({ status: 'success', message: 'Inserted', data: appContacts });
        });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateAppContact(req, res, next) {
  logger.winston.info('Contacts.updateAppContact');

  db.none('update app_contacts set role = $1 where contact_id = $2', [req.body.role, req.params.contact_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeAppContact(req, res, next) {
  logger.winston.info('Contacts.removeAppContact');

  db.none('delete from app_contacts where contact_id = $1 and app_id = $2', [req.params.contact_id, req.params.app_id])
    .then(() => {
      apps.updateContentVersion(req.params.app_id);
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
