var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('settings.test', () => {
  describe('api/v1/settings', () => {
    it('getAllSettings: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/settings')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSingleSetting: should get a single record', (done) => {
      chai.request(app)
        .get('/api/v1/settings/app_category')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
