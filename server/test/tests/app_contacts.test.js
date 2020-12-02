var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('app_contacts.test', () => {
  describe('api/v1/apps/1/contacts', () => {
    it('createAppContact: should create a new record', (done) => {
      let obj = {
        contact_id: common.contactId,
        role: 'AppOwner'
      };
      chai.request(app)
        .post('/api/v1/apps/' + common.appId + '/contacts')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('getAllAppContacts: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/contacts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('removeAppContact: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId + '/contacts/' + common.contactId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});
