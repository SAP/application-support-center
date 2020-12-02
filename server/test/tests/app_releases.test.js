var common = require('../common');
var chai = common.chai;
var app = common.app;
var releaseId;

describe('app_Release.test', () => {
  describe('api/v1/apps/1', () => {
    it('createAppRelease: should create a new record', (done) => {
      let obj = {
        version: 'v2.0.0',
        release_date: '1/1/2020',
        description: 'v2 release notes',
        app_id: 1
      };
      chai.request(app)
        .post('/api/v1/apps/' + common.appId + '/releases')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          releaseId = res.body.data.release_id;
          done();
        });
    });

    it('getAllAppReleases: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/releases')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSingleAppRelease: should get a single record', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/releases/' + releaseId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('release_id').eql(releaseId);
          done();
        });
    });

    it('updateAppRelease: should update a record', (done) => {
      let obj = {
        version: 'v1.0.1'
      };
      chai.request(app)
        .put('/api/v1/apps/' + common.appId + '/releases/' + releaseId)
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeAppRelease: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId + '/releases/' + releaseId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});
