module.exports = {
  getAllContacts,
  getContactApps,
  createContact,
  updateContact,
  removeContact
};

const db = require('./db');
const logger = require('../util/logger');

function getAllContacts(req, res, next) {
  logger.winston.info('Contacts.getAllContacts');
  db.any('select * from contacts order by last_name')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error('getAllContacts: ' + err);
      res.status(400).json({ data: err });
    });
}

function getContactApps(req, res, next) {
  logger.winston.info('Contacts.getContactApps');
  db.any('select app_id, app_name, role from contacts inner join app_contacts using (contact_id) inner join apps using (app_id) where contact_id = $1 order by app_name', [req.params.contact_id])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.winston.error('getContactApps: ' + err);
      res.status(400).json({ data: err });
    });
}

function createContact(req, res, next) {
  logger.winston.info('Contacts.createContact');

  db.one('insert into contacts (external_id, first_name, last_name, email) values ($1, $2, $3, $4) returning *', [req.body.external_id, req.body.first_name, req.body.last_name, req.body.email])
    .then((data) => {
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: data.contact_id, data: data
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateContact(req, res, next) {
  logger.winston.info('Contacts.updateContact');

  db.none('update contacts set external_id = $1, first_name = $2, last_name = $3, email = $4 where contact_id = $5', [req.body.external_id, req.body.first_name, req.body.last_name, req.body.email, req.params.contact_id])
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Updated' });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeContact(req, res, next) {
  logger.winston.info('Contacts.removeContact');

  db.none('delete from contacts where contact_id = $1', [req.params.contact_id])
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}
