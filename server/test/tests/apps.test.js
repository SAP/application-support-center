var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('apps.test', () => {
  describe('api/v1/apps', () => {
    it('getAllApps: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSecureTokenForApp: should get secure token for the app', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/token')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSingleApp: should get a single record', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('app_id').eql(common.appId);
          done();
        });
    });

    it('updateApp: should update a record', (done) => {
      let obj = {
        app_name: 'SAP Relay Renamed'
      };
      chai.request(app)
        .put('/api/v1/apps/' + common.appId)
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
