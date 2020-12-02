var common = require('../common');
var chai = common.chai;
var app = common.app;
// var db = common.db;
// var appId;
var accessToken;

describe('api.test', () => {
  describe('api/v1/apps', () => {
    before(async () => {

    });

    it('getSecureTokenForApp: should get secure token for the app', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/token')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          accessToken = res.body[0].token;
          done();
        });
    });

    it('getAppData: return app data using the access token', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '?access_token=' + accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('getBulkData: return bulk data for the app using the access token', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/bulkdata?access_token=' + accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
