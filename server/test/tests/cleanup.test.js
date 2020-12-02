var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('apps.test', () => {
  describe('api/v1/apps', () => {
    it('removeApp: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeContact: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/contacts/' + common.contactId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});
