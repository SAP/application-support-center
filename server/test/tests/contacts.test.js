var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('contacts.test', () => {
  describe('api/v1/contacts', () => {
    it('getAllContacts: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/contacts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('updateContact: should update a record', (done) => {
      let obj = {
        first_name: 'Stevie'
      };
      chai.request(app)
        .put('/api/v1/contacts/' + common.contactId)
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});
